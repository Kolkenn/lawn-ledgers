import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

// Import components & pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SettingsPage from "./pages/SettingsPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoutes from "./components/ProtectedRoutes";
import CreateCompanyGuard from "./components/CreateCompanyGuard";
import CreateCompanyFlow from "./pages/company-creation/CreateCompanyFlow";
import Step1_Name from "./pages/company-creation/Step1_Name";
import Step2_Address from "./pages/company-creation/Step2_Address";
import Step3_Subscription from "./pages/company-creation/Step3_Subscription";
import Step4_ConnectOnboarding from "./pages/company-creation/Step4_ConnectOnboarding";
import SubscriptionBlocker from "./components/SubscriptionBlocker";

function App() {
  const { loading, sessionStatus, user, onboardingStatus } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If an owner needs to subscribe...
    if (onboardingStatus === "needsSubscription") {
      if (!location.pathname.startsWith("/create-company")) {
        navigate(`/create-company/subscription`);
      }
    }
  }, [onboardingStatus, navigate, location.pathname]);

  // The main loading spinner for the entire application.
  if (loading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center">
        <span className="loading loading-dots loading-lg"></span>
        <p className="mt-4 text-base">{sessionStatus}</p>
      </div>
    );
  }

  if (
    !loading &&
    user &&
    onboardingStatus === "subscriptionRequired_contactAdmin"
  ) {
    return <SubscriptionBlocker />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={!user ? <LoginPage /> : <Navigate to="/" />}
      />
      <Route
        path="/register"
        element={!user ? <RegisterPage /> : <Navigate to="/" />}
      />

      {/* --- Company Creation Flow (Standalone) --- */}
      <Route element={<CreateCompanyGuard />}>
        <Route path="/create-company" element={<CreateCompanyFlow />}>
          <Route index element={<Step1_Name />} />
          <Route path="address" element={<Step2_Address />} />
          <Route path="subscription" element={<Step3_Subscription />} />
          <Route
            path="connect-onboarding"
            element={<Step4_ConnectOnboarding />}
          />
        </Route>
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Catch-all Route */}
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
    </Routes>
  );
}

export default App;
