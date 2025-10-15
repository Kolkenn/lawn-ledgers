import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import AdminLayout from "./AdminLayout";
import CrewLayout from "./CrewLayout";

// Import your page components
import DashboardPage from "../pages/admin/DashboardPage";
import SchedulePage from "../pages/admin/SchedulePage";
import ClientsPage from "../pages/admin/ClientsPage";
import InvoicesPage from "../pages/admin/InvoicesPage";
import CompanySettingsPage from "../pages/admin/CompanySettingsPage";
import TodaysJobsPage from "../pages/crew/TodaysJobsPage";
import TimeclockPage from "../pages/crew/TimeclockPage";
import NotFoundPage from "../pages/NotFoundPage";

const AppLayout = () => {
  const { activeRole } = useAuth();
  console.log("🚦 [AppLayout] Rendering. Role:", activeRole);

  // Render the appropriate set of routes based on the user's role
  if (activeRole === "owner" || activeRole === "admin") {
    console.log(
      "👑 [AppLayout] Role is admin/owner. Rendering AdminLayout routes."
    );
    return (
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/settings" element={<CompanySettingsPage />} />
          <Route path="/jobs" element={<TodaysJobsPage />} />
          <Route path="/timeclock" element={<TimeclockPage />} />
          {/* Add other admin routes here */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    );
  }

  if (activeRole === "crew") {
    console.log("🛠️ [AppLayout] Role is crew. Rendering CrewLayout routes.");
    return (
      <Routes>
        <Route element={<CrewLayout />}>
          <Route index element={<Navigate to="/jobs" replace />} />
          <Route path="/jobs" element={<TodaysJobsPage />} />
          <Route path="/timeclock" element={<TimeclockPage />} />
          {/* Add other crew routes here */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    );
  }

  // Fallback for users with no role or an error state
  console.log("⛔ [AppLayout] No valid role found.");
  return <div>Error: User role not found.</div>;
};

export default AppLayout;
