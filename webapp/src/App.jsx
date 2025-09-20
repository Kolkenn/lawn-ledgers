import { useAuth } from "./context/AuthContext";
import { Routes, Route, Navigate } from "react-router-dom";

// Import components & pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateCompanyPage from "./pages/CreateCompanyPage";
import SettingsPage from "./pages/SettingsPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoutes from "./components/ProtectedRoutes";

function App() {
  const { loading, user } = useAuth();

  // The main loading spinner for the entire application.
  if (loading) {
    return (
      <span className="flex justify-center loading loading-dots loading-xl"></span>
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

      {/* All protected routes now live under a single guard */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/create-company" element={<CreateCompanyPage />} />
      </Route>

      {/* Catch-all Route */}
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
    </Routes>
  );
}

export default App;
