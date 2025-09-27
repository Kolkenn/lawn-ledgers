// src/components/ProtectedRoutes.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoutes = () => {
  const { loading, user, memberships, activeCompany } = useAuth();

  console.log("🛡️ [ProtectedRoutes] Rendering. Status:", {
    loading,
    user: !!user,
    activeCompany: !!activeCompany,
  });

  if (loading) {
    if (loading) {
      console.log("⏳ [ProtectedRoutes] Loading...");
      return null;
    }
  }

  // 1. If the user isn't logged in, send them to the login page.
  if (!user) {
    console.log("⛔ [ProtectedRoutes] No user found. Redirecting to /login.");
    return <Navigate to="/login" />;
  }

  // 2. If the user is logged in but has NO memberships, force them to the creation flow.
  if (memberships.length === 0) {
    console.log(
      "🏢 [ProtectedRoutes] User has NO company assigned. Redirecting to create one."
    );
    return <Navigate to="/create-company" />;
  }

  console.log("✅ [ProtectedRoutes] All checks passed. Rendering application.");
  return <Outlet />;
};

export default ProtectedRoutes;
