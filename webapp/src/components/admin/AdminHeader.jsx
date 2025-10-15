import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { handleLogout } from "../../firebase/authService";
import { Menu, LogOut, Settings } from "lucide-react";
import LanguageSwitcher from "../LanguageSwitcher";
import ThemeController from "../ThemeController";
import { adminNavLinks } from "../../data/adminNavLinks";
import { useTranslation } from "react-i18next";

const AdminHeader = ({ setIsModalOpen }) => {
  const { user } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  // ADD: This effect runs every time the URL changes.
  useEffect(() => {
    // If there's an active element (like the focused dropdown trigger), blur it.
    if (document.activeElement) {
      document.activeElement.blur();
    }
  }, [location.pathname]); // Dependency array ensures it runs on navigation

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
            {adminNavLinks.map(({ name, path, icon: Icon }) => (
              <li key={path}>
                <NavLink to={path}>
                  <Icon size={16} />
                  {t(name)}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <NavLink
          to="/dashboard"
          className="btn btn-ghost normal-case text-primary text-xl hidden lg:flex"
        >
          Lawn Ledgers
        </NavLink>
      </div>

      {/* Desktop Menu (navbar-center) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {adminNavLinks.map(({ name, path }) => (
            <li key={path}>
              <NavLink to={path}>{t(name)}</NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Profile Icon (navbar-end) */}
      <div className="navbar-end">
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeController />
        </div>

        {/* User Dropdown */}
        <div className="dropdown dropdown-end ml-4">
          <label
            tabIndex={0}
            className="btn btn-circle avatar avatar-placeholder"
            title="User Menu"
          >
            <div className="bg-primary w-10 rounded-full">
              <div className="bg-neutral-focus text-xl rounded-full w-10">
                <span>{user?.email?.[0]?.toUpperCase()}</span>
              </div>
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-35"
          >
            <li>
              <a onClick={() => setIsModalOpen(true)}>
                <Settings size={20} />
                User Settings
              </a>
            </li>
            <div className="divider my-1"></div>
            <li>
              <a onClick={handleLogout} className="text-error">
                <LogOut size={20} />
                Log Out
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
