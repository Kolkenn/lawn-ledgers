// src/pages/company-creation/Step3_Subscription.jsx
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

const TIER_PRICE_IDS = {
  starter: "price_1S7caTAMPnQQvgQLQXn5JZhT",
  growth: "price_1S7catAMPnQQvgQLc8tC044Q",
};

const Step3_Subscription = () => {
  const { companyData } = useOutletContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Guard: Redirect if prior steps are not complete.
  useEffect(() => {
    if (!companyData.name || !companyData.address) {
      navigate("/create-company/address");
    }
  }, [companyData, navigate]);

  /**
   * Initiates either a trial or a paid subscription checkout.
   * @param {boolean} isTrial - True if the user selected the trial option.
   */
  const handleInitiateCheckout = async (isTrial, selectedPlan) => {
    setIsLoading(true);
    try {
      // This is the function you will write at the end of the entire flow
      // to create the company document in Firestore *before* checkout.
      const companyId = await createCompanyInFirestore();
      if (!companyId) throw new Error("Failed to create company document.");

      const response = await fetch(
        "http://127.0.0.1:8000/api/stripe/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            priceId: selectedPlan,
            companyId: companyId,
            isTrial: isTrial, // <-- The new flag!
          }),
        }
      );
      const session = await response.json();
      window.location.href = session.url;
    } catch (error) {
      console.error("Error creating company or checkout session:", error);
      alert("Could not complete setup. Please try again.");
      setIsLoading(false);
    }
  };

  const createCompanyInFirestore = async () => {
    try {
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
        subscription: {
          plan: companyData.subscriptionTier,
          status:
            companyData.subscriptionTier === "trial" ? "trialing" : "active",
          startDate: serverTimestamp(),
        },
        ownerUid: user.uid,
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

  return (
    <div>
      <h2 className="card-title mb-4">Choose Your Plan</h2>
      <div className="card-actions justify-center space-x-4 mt-6">
        <button
          onClick={() => handleInitiateCheckout(true, TIER_PRICE_IDS.starter)}
          className="btn btn-outline btn-primary"
          disabled={isLoading}
        >
          Start 14-Day Free Trial
        </button>
        <button
          onClick={() => handleInitiateCheckout(false, TIER_PRICE_IDS.starter)}
          className="btn btn-primary"
          disabled={isLoading}
        >
          Subscribe Now
        </button>
      </div>
      <div className="card-actions justify-between mt-12">
        <button
          type="button"
          onClick={() => navigate("/create-company/address")}
          className="btn btn-ghost"
          disabled={isLoading}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default Step3_Subscription;
