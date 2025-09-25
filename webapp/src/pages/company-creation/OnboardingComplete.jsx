import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const OnboardingComplete = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("checking"); // 'checking', 'success', 'incomplete'
  const [error, setError] = useState(null);
  const { activeCompany } = useAuth();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/company/status/${activeCompany.id}`
        );

        if (!response.ok) {
          throw new Error("Could not verify setup status.");
        }

        const data = await response.json();

        // Check if both subscription and payment setup are active.
        const isSubscribed =
          data.subscription?.status === "active" ||
          data.subscription?.status === "trialing";
        const paymentsEnabled = data.stripeConnect?.charges_enabled === true;

        if (isSubscribed && paymentsEnabled) {
          setStatus("success");
        } else {
          setStatus("incomplete");
        }
      } catch (err) {
        setError(err.message);
        setStatus("error");
      }
    };

    checkStatus();
  }, [activeCompany.id]);

  const renderStatus = () => {
    switch (status) {
      case "success":
        return (
          <>
            <h2 className="card-title text-success">Setup Complete!</h2>
            <p>
              Your subscription is active and you are now ready to accept
              payments.
            </p>
          </>
        );
      case "incomplete":
        return (
          <>
            <h2 className="card-title text-warning">Almost there!</h2>
            <p>
              Your subscription is active, but your payment account setup is not
              yet complete. You can finish this at any time from your settings.
            </p>
          </>
        );
      case "error":
        return (
          <>
            <h2 className="card-title text-error">An Error Occurred</h2>
            <p>{error}</p>
          </>
        );
      default:
        return <p>Verifying your setup...</p>;
    }
  };

  return (
    <div>
      {renderStatus()}
      <div className="card-actions justify-center mt-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="btn btn-primary"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default OnboardingComplete;
