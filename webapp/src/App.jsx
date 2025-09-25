import { useAuth } from "./context/AuthContext";
import { Routes, Route, Navigate } from "react-router-dom";

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
import Step3_Subscription from "./pages/company-creation/Step3_Suscription";
import Step4_ConnectOnboarding from "./pages/company-creation/Step4_ConnectOnboarding";
import OnboardingComplete from "./pages/company-creation/OnboardingComplete";

function App() {
  const { loading, sessionStatus, user } = useAuth();

  // The main loading spinner for the entire application.
  if (loading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center">
        <span className="loading loading-dots loading-lg"></span>
        <p className="mt-4 text-base">{sessionStatus}</p>
      </div>
    );
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
          <Route path="onboard-status" element={<OnboardingComplete />} />
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
