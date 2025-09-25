import { useState, useEffect, useContext } from "react";
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
  const { user, setActiveCompanyById } = useAuth();
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
    setIsLoading(true);
    try {
      // Create the company in Firestore.
      const companyId = await createCompanyInFirestore();
      if (!companyId) throw new Error("Failed to create company.");

      await setActiveCompanyById(companyId);

      const response = await fetch(
        "http://127.0.0.1:8000/api/stripe/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            priceId: selectedPlan,
            companyId: companyId,
            isTrial: isTrial,
          }),
        }
      );
      const { url } = await response.json();
      window.location.href = url;
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
        ownerUid: user.uid,
        ownerEmail: user.email,
        ownerName: user.name,
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
      <h3 className="font-bold mb-4">Choose Your Subscription</h3>
      <div className="card-actions justify-center space-x-4 mt-6">
        <button
          onClick={() => handleFinalizeSetup(true, TIER_PRICE_IDS.starter)}
          className="btn btn-primary "
          disabled={isLoading}
        >
          Start 14-Day Free Trial
        </button>
        <button
          onClick={() => handleFinalizeSetup(false, TIER_PRICE_IDS.starter)}
          className="btn btn-primary"
          disabled={isLoading}
        >
          Starter Plan
        </button>
        <button
          onClick={() => handleFinalizeSetup(false, TIER_PRICE_IDS.growth)}
          className="btn btn-primary"
          disabled={isLoading}
        >
          Growth Plan
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
