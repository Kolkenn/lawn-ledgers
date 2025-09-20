// src/components/ProtectedRoutes.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppLayout from "./AppLayout";

const ProtectedRoutes = () => {
  const { user } = useAuth();

  // The ONLY job of this component is to check if a user is logged in.
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If they are logged in, render the standard layout.
  // The <Outlet /> will render whichever child route is matched.
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export default ProtectedRoutes;
