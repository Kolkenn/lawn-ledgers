import { NavLink } from "react-router-dom";
import { Home, Calendar, Users, FileText, Settings } from "lucide-react";

const AdminSidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Schedule", path: "/schedule", icon: Calendar },
    { name: "Clients", path: "/clients", icon: Users },
    { name: "Invoices", path: "/invoices", icon: FileText },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  // Replace your existing return statement with this one.
  return (
    <>
      {/* 1. Mobile Overlay: appears behind the sidebar, closes it on click */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden ${
          isSidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* 2. The Sidebar Itself */}
      <aside
        className={`fixed inset-y-0 left-0 flex-col w-64 bg-base-100 border-r border-base-300 z-40 transform transition-transform 
        md:relative md:translate-x-0 md:flex 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-4 font-bold text-xl border-b border-base-300">
          Lawn Ledgers
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              // 3. Close sidebar on navigation
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg gap-3 transition-colors ${
                  isActive
                    ? "bg-primary text-primary-content"
                    : "hover:bg-base-200"
                }`
              }
            >
              <link.icon size={20} />
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
