import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CreateCompanyGuard = () => {
  const { loading, user, memberships } = useAuth();

  if (loading) {
    return null;
  }

  // 1. If the user isn't logged in, send them to the login page.
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 2. If they are logged in, allow them to see the creation flow.
  // The <Outlet> will render the CreateCompanyFlow component and its nested steps.
  return <Outlet />;
};

export default CreateCompanyGuard;
