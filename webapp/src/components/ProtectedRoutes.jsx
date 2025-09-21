// src/components/ProtectedRoutes.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppLayout from "./AppLayout";

const ProtectedRoutes = () => {
  const { loading, user, memberships } = useAuth();

  if (loading) {
    return null;
  }

  // 1. If the user isn't logged in, send them to the login page.
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 2. If the user is logged in but has NO memberships, force them to the creation flow.
  if (memberships.length === 0) {
    return <Navigate to="/create-company" />;
  }

  // 3. If all checks pass, render the main app layout..
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export default ProtectedRoutes;
