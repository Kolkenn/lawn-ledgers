import stripe
import os
from fastapi import FastAPI, Request, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

# --- Firebase Admin Setup ---
# Initialize Firebase Admin SDK.
# Ensure your 'serviceAccountKey.json' is in the backend directory.
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()
# -----------------------------

load_dotenv() # Load environment variables from .env file
app = FastAPI() # Initialize FastAPI app

# Configure CORS (Cross-Origin Resource Sharing)
# This is necessary to allow your frontend (running on localhost:5173)
# to communicate with your backend (running on localhost:8000).
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set your Stripe secret key from the environment variable
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")
CLIENT_BASE_URL = os.getenv("CLIENT_BASE_URL", "http://localhost:5173")

@app.get("/")
def read_root():
    return {"Hello": "From LawnLedgers Backend"}

class CheckoutSessionRequest(BaseModel):
    priceId: str
    companyId: str

@app.post("/api/stripe/create-checkout-session")
async def create_checkout_session(payload: CheckoutSessionRequest):
    """
    Creates a Stripe Checkout session for a new subscription.
    """
    price_id = payload.priceId
    company_id = payload.companyId
    try:
        # Check if this company already has a Stripe Customer ID
        company_ref = db.collection('companies').document(company_id)
        company_doc = company_ref.get()
        stripe_customer_id = None

        if company_doc.exists and company_doc.to_dict().get('subscription', {}).get('stripeCustomerId'):
            stripe_customer_id = company_doc.to_dict()['subscription']['stripeCustomerId']
            print(f"Found existing Stripe Customer ID for company {company_id}: {stripe_customer_id}")

        # This is the URL the user will be sent to after a successful payment.
        success_url = f"{CLIENT_BASE_URL}/settings?session_id={{CHECKOUT_SESSION_ID}}"
        # This is the URL they will be sent to if they cancel.
        cancel_url = f"{CLIENT_BASE_URL}/settings"

        checkout_params = {
            'line_items': [{'price': price_id, 'quantity': 1}],
            'mode': 'subscription',
            'success_url': success_url,
            'cancel_url': cancel_url,
            # This ensures the subscription object has our internal ID from the very beginning.
            'subscription_data': {
                'metadata': {
                    'company_id': company_id
                }
            }
        }
        
        # If we have an existing customer, use them to avoid duplicates.
        if stripe_customer_id:
            checkout_params['customer'] = stripe_customer_id

        checkout_session = stripe.checkout.Session.create(**checkout_params)
        
        return {"url": checkout_session.url}
    except Exception as e:
        print("Error creating checkout session:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/stripe/create-portal-session")
async def create_portal_session(request: Request):
    """
    Creates a Stripe Customer Portal session for managing an existing subscription.
    """
    try:
        data = await request.json()
        stripe_customer_id = data.get('stripeCustomerId')

        if not stripe_customer_id:
            raise HTTPException(status_code=400, detail="Stripe Customer ID is required.")

        return_url = f"{CLIENT_BASE_URL}/settings"
        print("Creating portal session for customer:", stripe_customer_id)
        portal_session = stripe.billing_portal.Session.create(
            customer=stripe_customer_id,
            return_url=return_url,
        )
        print("Portal session created:", portal_session.url)
        return {"url": portal_session.url}
    except Exception as e:
        print("Error creating portal session:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

# --- Main Webhook Endpoint ---
@app.post("/api/stripe/webhook")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    """
    Secure endpoint to listen for Stripe events and update subscription status.
    """
    payload = await request.body()
    
    try:
        event = stripe.Webhook.construct_event(
            payload=payload, sig_header=stripe_signature, secret=STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        # Invalid payload
        raise HTTPException(status_code=400, detail=str(e))
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        raise HTTPException(status_code=400, detail=str(e))

    event_type = event['type']
    data_object = event['data']['object']
    
    print(f"Received Stripe event: {event_type}")

    # These are the events that directly reflect the subscription's state
    SUBSCRIPTION_EVENTS = {
        'customer.subscription.created',
        'customer.subscription.updated',
        'customer.subscription.deleted'
    }

    try:
        if event_type in SUBSCRIPTION_EVENTS:
            # These events are the source of truth for the subscription state.
            # The `data_object` here IS the subscription object.
            subscription = data_object
            _update_firestore_subscription(subscription)

        else:
            print(f"Unhandled event type: {event_type}")

    except Exception as e:
        # Catch exceptions from our helper function or other logic
        print(f"An error occurred while processing event {event.id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error.")

    # Acknowledge receipt of the event to Stripe
    return {"status": "success"}

# --- Helper Function for DB Update ---
def _update_firestore_subscription(subscription: stripe.Subscription):
    """
    A dedicated function to update Firestore with subscription data.
    This keeps the main webhook logic clean.
    """
    company_id = subscription.metadata.get('company_id')
    if not company_id:
        print(f"ERROR: Webhook for subscription {subscription.id} is missing 'company_id' in metadata.")
        # We don't raise an exception here because we still need to send a 200 to Stripe.
        # This is a critical error to monitor in your logs.
        return

    print(f"Updating Firestore for company: {company_id} from subscription: {subscription.id}")
    try:
        company_ref = db.collection('companies').document(company_id)
        
        # Using robust dictionary-style access for nested data
        subscription_data = {
            'stripeCustomerId': subscription.get('customer'),
            'stripeSubscriptionId': subscription.get('id'),
            'status': subscription.get('status'),
            'planId': subscription['items']['data'][0]['price']['lookup_key'],
            'currentPeriodEnd': subscription['items']['data'][0]['current_period_end'],
            'cancelAtPeriodEnd': subscription.get('cancel_at_period_end'),
            # You can add more fields here as needed
            'lastUpdated': firestore.SERVER_TIMESTAMP
        }
        
        # Safely update the document without overwriting other company data
        company_ref.set({'subscription': subscription_data}, merge=True)
        print(f"Successfully updated subscription for company: {company_id}")

    except Exception as e:
        print(f"FATAL: Error updating Firestore for company {company_id}: {e}")
        # Re-raising here to be caught by the main handler, which will return a 500
        raise e