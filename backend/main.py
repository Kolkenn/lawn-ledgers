from typing import Optional
import stripe
import os
from fastapi import FastAPI, Request, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timezone

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
cors_origins = os.getenv("CORS_ORIGINS", "")
origins = [origin.strip() for origin in cors_origins.split(",")]
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
    isTrial: Optional[bool] = False

@app.post("/api/stripe/create-checkout-session")
async def create_checkout_session(payload: CheckoutSessionRequest):
    """
    Creates a Stripe Checkout session for a new subscription,
    with an optional trial period.
    """
    price_id = payload.priceId
    company_id = payload.companyId
    is_trial = payload.isTrial
    try:
        # Check if this company already has a Stripe Customer ID
        company_ref = db.collection('companies').document(company_id)
        company_doc = company_ref.get()
        stripe_customer_id = None

        if company_doc.exists and company_doc.to_dict().get('subscription', {}).get('stripeCustomerId'):
            stripe_customer_id = company_doc.to_dict()['subscription']['stripeCustomerId']
            print(f"Found existing Stripe Customer ID for company {company_id}: {stripe_customer_id}")

        # This is the URL the user will be sent to after a successful payment.
        success_url = f"{CLIENT_BASE_URL}/create-company/connect-onboarding"
        # This is the URL they will be sent to if they cancel.
        cancel_url = f"{CLIENT_BASE_URL}/create-company/subscription" # Go back to subscription choice

        subscription_data = {
            'metadata': {
                'company_id': company_id
            }
        }

        if is_trial:
            subscription_data['trial_period_days'] = 14

        checkout_params = {
            'line_items': [{'price': price_id, 'quantity': 1}],
            'mode': 'subscription',
            'success_url': success_url,
            'cancel_url': cancel_url,
            'customer_email': company_doc.get('ownerEmail'),
            # This ensures the subscription object has our internal ID from the very beginning.
            'subscription_data': subscription_data
        }
        
        # If we have an existing customer, use them to avoid duplicates.
        if stripe_customer_id:
            checkout_params['customer'] = stripe_customer_id

        checkout_session = stripe.checkout.Session.create(**checkout_params)
        
        return {"url": checkout_session.url}
    except Exception as e:
        print("Error creating checkout session:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

class ConnectLinkRequest(BaseModel):
    companyId: str
    prefillData: bool

@app.post("/api/stripe/create-connect-account-link")
async def create_connect_account_link(payload: ConnectLinkRequest):
   """
   Creates a Stripe Connect Account if one doesn't exist,
   then generates and returns an onboarding link.
   """
   try:
       company_ref = db.collection('companies').document(payload.companyId)
       company_doc = company_ref.get()
       if not company_doc.exists:
           raise HTTPException(status_code=404, detail="Company not found.")
       company_data = company_doc.to_dict()

       stripe_account_id = company_data.get('stripeAccountId')

       # Create a new Connect Account only if one doesn't already exist.
       if not stripe_account_id:
           # ADD: Conditionally build the account creation parameters.
           account_params = {
               "type": "standard",
               "metadata": {"company_id": payload.companyId}
           }

           if payload.prefillData:
                print(f"Pre-filling data for company: {payload.companyId}")
                
                # --- Parse User's Name to Prefill ---
                name_parts = company_data.get('ownerName', '').strip().split()

                first_name = ""
                last_name = ""

                if len(name_parts) == 1:
                    first_name = name_parts[0]
                elif len(name_parts) > 1:
                    first_name = " ".join(name_parts[:-1])
                    last_name = name_parts[-1]
                
                # Combine all pre-fill data into a single dictionary
                prefill_data = {
                    "email": company_data.get('ownerEmail'),
                    "business_profile": {
                        "name": company_data.get('name'),
                    },
                    "company": {
                        "name": company_data.get('name'),
                        "address": {
                            "line1": company_data.get('address', {}).get('street'),
                            "city": company_data.get('address', {}).get('city'),
                            "state": company_data.get('address', {}).get('state'),
                            "postal_code": company_data.get('address', {}).get('zip'),
                            "country": "US"
                        }
                    },
                    "individual": {
                        'first_name': first_name,
                        'last_name': last_name,
                        'email': company_data.get('ownerEmail')
                    }
                }
                
                # Use a single update call to add all the data at once.
                account_params.update(prefill_data)

            # The stripe.Account.create(**account_params) call remains the same
           account = stripe.Account.create(**account_params)
           stripe_account_id = account.id
           company_ref.set({'stripeAccountId': stripe_account_id}, merge=True)

       # Create the account link for onboarding.
       account_link = stripe.AccountLink.create(
           account=stripe_account_id,
           refresh_url=f"{CLIENT_BASE_URL}/create-company/connect-onboarding", 
           return_url=f"{CLIENT_BASE_URL}/onboard-status",
           type="account_onboarding",
       )
       return {"url": account_link.url}
   except Exception as e:
       print(f"Error creating account link for company {payload.companyId}: {str(e)}")
       raise HTTPException(status_code=500, detail=str(e))

# ADD: New endpoint for the Step 4 page to check status.
@app.get("/api/company/status/{company_id}")
async def get_company_status(company_id: str):
   """
   Retrieves and returns the subscription and connect status for a company.
   """
   try:
       company_ref = db.collection('companies').document(company_id)
       company_doc = company_ref.get()
       if not company_doc.exists:
           raise HTTPException(status_code=404, detail="Company not found.")
       return company_doc.to_dict()
   except Exception as e:
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

    try:
        if event_type.startswith('customer.subscription.'):
            # These events are the source of truth for the subscription state.
            # The `data_object` here IS the subscription object.
            subscription = data_object
            _update_firestore_subscription(subscription)
        elif event_type == 'account.updated':
            # ADD: Handle updates to the Connected Account.
            # This tells you when their onboarding is complete and they can accept payments.
            account = data_object
            _update_firestore_account(account)
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

        # Get the UNIX timestamp from the Stripe object
        unix_timestamp = subscription['items']['data'][0]['current_period_end']
        # Convert the UNIX timestamp to a timezone-aware datetime object
        period_end_datetime = datetime.fromtimestamp(unix_timestamp, tz=timezone.utc)
        
        # Using robust dictionary-style access for nested data
        subscription_data = {
            'stripeCustomerId': subscription.get('customer'),
            'stripeSubscriptionId': subscription.get('id'),
            'status': subscription.get('status'),
            'planId': subscription['items']['data'][0]['price']['lookup_key'],
            'currentPeriodEnd': period_end_datetime,
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

# Helper function to handle `account.updated` events.
def _update_firestore_account(account: stripe.Account):
    """
    Updates Firestore with the status of a Stripe Connected Account.
    """
    company_id = account.metadata.get('company_id')
    if not company_id:
        print(f"ERROR: Webhook for account {account.id} is missing 'company_id' in metadata.")
        return

    print(f"Updating account status for company: {company_id} from account: {account.id}")
    try:
        company_ref = db.collection('companies').document(company_id)
        
        account_data = {
            'charges_enabled': account.get('charges_enabled'),
            'payouts_enabled': account.get('payouts_enabled'),
            'details_submitted': account.get('details_submitted'),
        }
        
        company_ref.set({'stripeConnect': account_data}, merge=True)
        print(f"Successfully updated Connect status for company: {company_id}")

    except Exception as e:
        print(f"FATAL: Error updating Firestore for company {company_id} from account update: {e}")
        raise e