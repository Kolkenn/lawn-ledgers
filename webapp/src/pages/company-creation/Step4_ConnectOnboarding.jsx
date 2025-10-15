import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Step4_ConnectOnboarding = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [prefillData, setPrefillData] = useState(true);
  const { setActiveCompanyById } = useAuth();
  let companyId = sessionStorage.getItem("onboardingCompanyId");

  const handleEnablePayments = async () => {
    setIsLoading(true);
    try {
      // This is the new, dedicated backend endpoint.
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_API_URL
        }/api/stripe/create-connect-account-link`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            companyId: companyId,
            prefillData: prefillData,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create Stripe onboarding link.");
      }

      const { url } = await response.json();
      window.location.href = url; // Redirect the user to the Stripe onboarding flow.
    } catch (error) {
      console.error("Error enabling payments:", error);
      alert("Could not start payment setup. Please try again later.");
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    // Set Active Company
    setActiveCompanyById(companyId);
    // If they skip, clear session cache.
    sessionStorage.removeItem("companyCreationData");
    sessionStorage.removeItem("onboardingCompanyId");
    // Send them to their main dashboard.
    navigate("/");
  };

  return (
    <div>
      <h2 className="card-title mb-4">Enable Payments on Your Platform</h2>
      <div className="p-4 border rounded-lg bg-base-200">
        <p className="font-bold">
          Before you start, please be ready to provide:
        </p>
        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
          <li>Your legal business name, address, and EIN (if applicable).</li>
          <li>
            Details for the business owner or representative (Name, DOB, SSN
            last 4).
          </li>
          <li>Your business bank account information for payouts.</li>
        </ul>
        <p className="text-xs mt-3">
          This information is sent directly to Stripe for identity verification
          and is required by financial regulations to securely process payments.
        </p>
      </div>

      <div className="form-control my-6">
        <label className="label cursor-pointer justify-start gap-4">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            checked={prefillData}
            onChange={(e) => setPrefillData(e.target.checked)}
          />
          <span className="label-text">
            Pre-fill setup form with my company information
          </span>
        </label>
      </div>

      <div className="card-actions justify-center space-x-4 mt-8">
        <button
          onClick={handleEnablePayments}
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? "Please wait..." : "Enable Payments Now"}
        </button>
        <button
          onClick={handleSkip}
          className="btn btn-outline"
          disabled={isLoading}
        >
          I'll Do This Later
        </button>
      </div>
    </div>
  );
};

export default Step4_ConnectOnboarding;
