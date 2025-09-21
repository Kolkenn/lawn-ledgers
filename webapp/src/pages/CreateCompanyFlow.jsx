import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { handleLogout } from "../firebase/authService";
import { LogOut } from "lucide-react";

// A simple stepper component to show progress
const Stepper = ({ currentStep }) => {
  const steps = ["Company Name", "Address", "Subscription"];
  return (
    <ul className="steps w-full mb-8">
      {steps.map((step, index) => (
        <li
          key={step}
          className={`step ${index < currentStep ? "step-primary" : ""}`}
        >
          {step}
        </li>
      ))}
    </ul>
  );
};

const CreateCompanyFlow = () => {
  const [companyData, setCompanyData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    subscriptionTier: null,
  });

  // Determine current step from URL for the Stepper
  const location = useLocation();
  let currentStep = 1;
  if (location.pathname.includes("address")) currentStep = 2;
  if (location.pathname.includes("subscription")) currentStep = 3;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-base-100">
      <div className="flex items-center space-x-2 absolute top-4 right-4">
        <button
          onClick={handleLogout}
          className="cursor-pointer w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-full hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
        >
          <LogOut />
        </button>
      </div>
      <div className="card w-full max-w-2xl bg-base-300 shadow-xl">
        <div className="card-body">
          <Stepper currentStep={currentStep} />
          {/* The <Outlet> will render the current step's component */}
          {/* We pass state and the setter function via its context prop */}
          <Outlet context={{ companyData, setCompanyData }} />
        </div>
      </div>
    </div>
  );
};

export default CreateCompanyFlow;
