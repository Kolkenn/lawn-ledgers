import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { handleLogout } from "../../firebase/authService";
import { LogOut } from "lucide-react";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import ThemeController from "../../components/ThemeController";

// A simple stepper component to show progress
const Stepper = ({ currentStep }) => {
  const steps = [
    "Company Name",
    "Address",
    "Subscription",
    "Payment Processing",
  ];
  return (
    <ul className="steps w-full mb-5">
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
  // 1. Initialize state from sessionStorage, or use a default object if nothing is saved.
  const [companyData, setCompanyData] = useState(() => {
    const savedData = sessionStorage.getItem("companyCreationData");
    return savedData
      ? JSON.parse(savedData)
      : {
          name: "",
          address: "",
          city: "",
          state: "",
          zip: "",
        };
  });
  // 2. Use useEffect to save the state to sessionStorage whenever it changes.
  useEffect(() => {
    sessionStorage.setItem("companyCreationData", JSON.stringify(companyData));
  }, [companyData]);

  // Determine current step from URL for the Stepper
  const location = useLocation();
  let currentStep = 1;
  if (location.pathname.includes("address")) currentStep = 2;
  if (location.pathname.includes("subscription")) currentStep = 3;
  if (location.pathname.includes("connect-onboarding")) currentStep = 4;

  return (
    <div className="flex flex-col h-screen bg-base-100">
      {/* Div 1: The top action bar. */}
      <div className="flex-shrink-0 flex justify-end items-center p-4 space-x-2">
        <LanguageSwitcher />
        <ThemeController />
        <button
          onClick={handleLogout}
          className="cursor-pointer w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-full hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
        >
          <LogOut />
        </button>
      </div>

      {/* This container will grow to fill the remaining space and center its content */}
      <div className="flex-grow flex items-center justify-center overflow-y-auto p-4">
        <div className="card w-auto-cols-auto bg-base-200 shadow-xl">
          <div className="card-body flex flex-col max-h-[90vh]">
            {/* Div 2: The Stepper. It will not shrink. */}
            <div className="flex-shrink-0">
              <Stepper currentStep={currentStep} />
            </div>

            {/* Div 3: The main content. It will grow and scroll if needed. */}
            <div className="flex-grow overflow-y-auto mt-4">
              <Outlet context={{ companyData, setCompanyData }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCompanyFlow;
