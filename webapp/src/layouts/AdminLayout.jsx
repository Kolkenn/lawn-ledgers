import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminMobileNav from "../components/admin/MobileNav";
import AdminHeader from "../components/admin/Header";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  console.log("✅ [AdminLayout] Component mounted.");
  return (
    <div className="flex flex-col h-screen bg-base-200">
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />

        <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
          <Outlet />
        </div>

        {/* Bottom Navigation for Mobile */}
        <AdminMobileNav />
      </main>
    </div>
  );
};

export default AdminLayout;
