import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { handleLogout } from "../../firebase/authService";
import {
  Home,
  Calendar,
  Users,
  FileText,
  Settings,
  Menu,
  LogOut,
} from "lucide-react";
import LanguageSwitcher from "../LanguageSwitcher";
import ThemeController from "../ThemeController";
import PersonalSettings from "../settings/PersonalSettings";

const AdminHeader = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  // ADD: This effect runs every time the URL changes.
  useEffect(() => {
    // If there's an active element (like the focused dropdown trigger), blur it.
    if (document.activeElement) {
      document.activeElement.blur();
    }
  }, [location.pathname]); // Dependency array ensures it runs on navigation

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Schedule", path: "/schedule", icon: Calendar },
    { name: "Clients", path: "/clients", icon: Users },
    { name: "Invoices", path: "/invoices", icon: FileText },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className="navbar bg-base-100 border-b border-base-300">
      {/* Mobile Dropdown Menu (navbar-start) */}
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <Menu size={20} />
          </label>
          <ul
            tabIndex={0}
            className="menu menu-xl dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            {navLinks.map((link) => (
              <li key={link.name}>
                <NavLink to={link.path}>
                  <link.icon size={16} />
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <a
          href="/dashboard"
          className="btn btn-ghost normal-case text-primary text-xl hidden lg:flex"
        >
          Lawn Ledgers
        </a>
      </div>

      {/* Desktop Menu (navbar-center) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink to={link.path}>{link.name}</NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Profile Icon (navbar-end) */}
      <div className="navbar-end">
        <div className="flex items-center gap-2 mr-2">
          <LanguageSwitcher />
          <ThemeController />
          <button
            onClick={handleLogout}
            className="btn btn-circle"
            title="Log Out"
          >
            <LogOut size={25} color="var(--color-error)" />
          </button>
        </div>

        {/* Make the avatar a button to open the modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-circle avatar avatar-placeholder"
          title="User Settings"
        >
          <div className="bg-primary w-10 rounded-full">
            <div className="bg-neutral-focus text-xl rounded-full w-10">
              <span>{user?.email?.[0]?.toUpperCase()}</span>
            </div>
          </div>
        </button>
        {/* DaisyUI Modal for User Settings */}
        <dialog className={`modal ${isModalOpen ? "modal-open" : ""}`}>
          <div className="modal-box">
            <button
              onClick={() => setIsModalOpen(false)}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
            <PersonalSettings />
          </div>
          {/* This form is a trick to close the modal by clicking the backdrop */}
          <form
            method="dialog"
            className="modal-backdrop"
            onClick={() => setIsModalOpen(false)}
          >
            <button>close</button>
          </form>
        </dialog>
      </div>
    </div>
  );
};

export default AdminHeader;
