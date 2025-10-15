import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoutes = () => {
  const {
    loading: isAuthLoading,
    user,
    memberships,
    isLoadingMemberships,
    isLoadingCompany,
  } = useAuth();

  const [loadingMessage, setLoadingMessage] = useState("Authenticating...");

  // This is the real loading check that determines if we are truly done.
  const isStillLoading =
    isAuthLoading || (user && (isLoadingMemberships || isLoadingCompany));

  console.log("🛡️ [ProtectedRoutes] Rendering. Status:", {
    isAuthLoading,
    isLoadingMemberships,
    user: !!user,
  });

  // This effect orchestrates the staged loading messages for a better UX feel.
  useEffect(() => {
    let timer;
    if (isAuthLoading) {
      setLoadingMessage("Authenticating...");
      console.info("⏳ [ProtectedRoutes] Auth loading.");
    } else if (user && isLoadingMemberships) {
      // Add a delay before showing the next message
      setLoadingMessage("Confirming Membership...");
      console.info("⏳ [ProtectedRoutes] Memberships loading.");
    } else if (user && isLoadingCompany) {
      setLoadingMessage("Loading Active Company...");
      console.info("⏳ [ProtectedRoutes] Company loading.");
    }
    return () => clearTimeout(timer);
  }, [isAuthLoading, user, isLoadingMemberships, isLoadingCompany]);

  // If any of the core data is still loading, show the loading screen.
  if (isStillLoading) {
    console.log(`⏳ [ProtectedRoutes] Loading: ${loadingMessage}`);
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="mt-4 text-lg">{loadingMessage}</p>
      </div>
    );
  }

  // 1. If the user isn't logged in, send them to the login page.
  if (!user) {
    console.log("⛔ [ProtectedRoutes] No user found. Redirecting to /login.");
    return <Navigate to="/login" />;
  }

  // 2. If the user is logged in but has NO memberships, force them to the creation flow.
  if (!isLoadingMemberships && memberships?.length === 0) {
    console.log(
      "🏢 [ProtectedRoutes] User has NO company assigned. Redirecting to create one."
    );
    return <Navigate to="/create-company" />;
  }

  console.log("✅ [ProtectedRoutes] All checks passed. Rendering application.");
  return <Outlet />;
};

export default ProtectedRoutes;
