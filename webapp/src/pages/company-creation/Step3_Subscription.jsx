import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import {
  doc,
  collection,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { Check } from "lucide-react";

// --- Reusable PlanCard Component ---
const PlanCard = ({ plan, onSelect, isLoading }) => (
  <div className="card card-border border-primary w-full">
    <div className="card-body flex flex-col">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
        <h2 className="text-xl font-bold">{plan.title}</h2>
        <span className="text-xl mt-2 sm:mt-0">{plan.price}</span>
      </div>
      <ul className="mt-6 flex flex-col gap-2 text-sm">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <Check size={16} color="var(--color-primary)" strokeWidth={4} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <div className="card-actions mt-auto pt-4">
        <button
          onClick={() => onSelect(plan.isTrial, plan.priceId)}
          className="btn btn-block btn-primary"
          disabled={isLoading}
        >
          {plan.buttonText}
        </button>
      </div>
    </div>
  </div>
);

const Step3_Subscription = () => {
  const { companyData } = useOutletContext();
  const { user } = useAuth();
  const ownerName = user.displayName || user.email;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Guard: Redirect if prior steps are not complete.
  useEffect(() => {
    if (!companyData.name || !companyData.address) {
      navigate("/create-company/address");
    }
  }, [companyData, navigate]);

  /**
   * Creates the company in Firestore and initiates a subscription checkout.
   */
  const handleFinalizeSetup = async (isTrial, selectedPlan) => {
    console.log("🚀 [INITIATE] Checkout process started.");
    setIsLoading(true);
    try {
      let currentCompanyId = sessionStorage.getItem("onboardingCompanyId");

      // If no company has been created yet in this session, create one.
      if (!currentCompanyId) {
        console.log(
          "📝 [CREATE] No existing company ID found. Creating new company in Firestore..."
        );
        const newCompanyId = await createCompanyInFirestore();
        if (!newCompanyId) {
          throw new Error("Failed to create company document.");
        }
        sessionStorage.setItem("onboardingCompanyId", newCompanyId);
        currentCompanyId = newCompanyId;
        console.log(
          `✅ [CREATE] Company created successfully with ID: ${currentCompanyId}`
        );
      } else {
        console.log(
          `🔷 [SKIP CREATE] Using existing company ID from state: ${currentCompanyId}`
        );
      }

      // Now, proceed with the Stripe checkout using the guaranteed company ID.
      const stripePayload = {
        priceId: selectedPlan,
        companyId: currentCompanyId,
        isTrial: isTrial,
      };

      console.log(
        "💳 [STRIPE] Sending request to create checkout session with payload:",
        stripePayload
      );

      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_API_URL
        }/api/stripe/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(stripePayload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Stripe checkout session failed.");
      }

      const session = await response.json();
      console.log(
        `🌐 [STRIPE] Successfully received session URL. Redirecting...`,
        session.url
      );
      window.location.href = session.url;
    } catch (error) {
      console.error(
        "🔥 [ERROR] An error occurred during the checkout process:",
        error
      );
      alert("Could not complete setup. Please try again.");
      setIsLoading(false);
    }
  };

  const createCompanyInFirestore = async () => {
    try {
      console.info("Attempting to create company.");
      // Use a batch write to ensure both documents are created at once.
      const batch = writeBatch(db);
      // 1. Create a new company document in Firestore with a unique ID
      const companyDocRef = doc(collection(db, "companies"));
      batch.set(companyDocRef, {
        name: companyData.name.trim(),
        address: {
          street: companyData.address.trim(),
          city: companyData.city.trim(),
          state: companyData.state.trim(),
          zip: companyData.zip.trim(),
        },
        ownerUid: user.uid,
        ownerEmail: user.email,
        ownerName: ownerName,
        createdAt: serverTimestamp(),
      });

      // 2. Create the owner's record in the company's 'members' sub-collection.
      const memberDocRef = doc(
        db,
        "companies",
        companyDocRef.id,
        "members",
        user.uid
      );
      batch.set(memberDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: "owner",
        joinedAt: serverTimestamp(),
      });

      // 3. Create the user's record in their own 'memberships' sub-collection.
      const userMembershipRef = doc(
        db,
        "users",
        user.uid,
        "memberships",
        companyDocRef.id
      );
      batch.set(userMembershipRef, {
        companyName: companyData.name.trim(),
        companyId: companyDocRef.id,
        role: "owner",
      });

      await batch.commit();

      return companyDocRef.id;
    } catch (error) {
      console.error("Error creating company:", error);
      alert("There was an error creating your company. Please try again.");
    }
  };

  const TIER_PRICE_IDS = {
    solo: "price_1S7caTAMPnQQvgQLQXn5JZhT",
    growth: "price_1S7catAMPnQQvgQLc8tC044Q",
  };
  const plans = [
    {
      id: "trial",
      title: "Free Trial",
      price: "$0/mo",
      features: ["All features from the Solo Plan"],
      priceId: TIER_PRICE_IDS.solo,
      isTrial: true,
      buttonText: "Start 14-Day Free Trial",
    },
    {
      id: "solo",
      title: "Solo Plan",
      price: "$50/mo",
      features: [
        "1 Admin, 10 Crew Users",
        "Core CRM & Scheduling",
        "Invoicing, Online Payments",
        "10 GB File Storage",
      ],
      priceId: TIER_PRICE_IDS.solo,
      isTrial: false,
      buttonText: "Subscribe to Solo",
    },
    {
      id: "growth",
      title: "Growth Plan",
      price: "$150/mo",
      features: [
        "3 Admin, 30 Crew Users",
        "Everything in the Solo Plan",
        "Advanced Route Optimization",
        "25 GB File Storage",
      ],
      priceId: TIER_PRICE_IDS.growth,
      isTrial: false,
      buttonText: "Subscribe to Growth",
    },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-5">Choose Your Plan</h2>
      {/* This is the responsive container:
        - `flex-col` stacks items vertically on mobile.
        - `md:flex-row` places items side-by-side on medium screens and up.
      */}
      <div className="flex flex-col md:flex-row gap-6">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onSelect={handleFinalizeSetup}
            isLoading={isLoading}
          />
        ))}
      </div>
      <div className="card-actions justify-between mt-6">
        <button
          type="button"
          onClick={() => navigate("/create-company/address")}
          className="btn btn-outline"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default Step3_Subscription;
