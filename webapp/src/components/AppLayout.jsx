import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import ThemeController from "../components/ThemeController";
import { handleLogout } from "../firebase/authService";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Languages,
  Menu,
} from "lucide-react";

const AppLayout = () => {
  const { t, i18n } = useTranslation();
  const { user, activeCompany } = useAuth();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const NavItem = ({ to, icon, children, onClick }) => (
    <li>
      <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
          `flex items-center p-3 my-1 rounded-lg transition-colors text-base-content hover:bg-base-200 ${
            isActive ? "!bg-primary text-primary-content" : ""
          }`
        }
      >
        {icon}
        <span className="ml-3 font-medium">{children}</span>
      </NavLink>
    </li>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-base-100 text-base-content">
      {/* Logo */}
      <div className="flex items-center justify-center h-15">
        <h1 className="text-2xl font-bold text-primary">LawnLedgers</h1>
      </div>

      <div className="divider divider-primary"></div>

      {/* Main Navigation */}
      <nav className="flex-grow p-2">
        <ul>
          <NavItem to="/" icon={<LayoutDashboard size={20} />}>
            {t("pageTitles.dashboard")}
          </NavItem>
          <NavItem to="/settings" icon={<Settings size={20} />}>
            {t("pageTitles.settings")}
          </NavItem>
        </ul>
      </nav>

      {/* Footer Controls */}
      <div className="p-4 border-t">
        {/* Language Switcher */}
        <LanguageSwitcher />
        <ThemeController />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="btn btn-ghost w-full justify-start mt-2"
        >
          <LogOut size={20} />
          <span className="ml-3 font-medium">{t("logOut")}</span>
        </button>
      </div>

      {/* User Profile Section */}
      <div className="p-2 border-t bg-base-200">
        <div className="flex items-center">
          <div className="avatar avatar-placeholder">
            <div className="bg-primary text-neutral-content rounded-full w-10">
              <span>{user?.displayName?.[0]?.toUpperCase()}</span>
            </div>
          </div>
          <div className="ml-3">
            <p className="font-semibold text-sm">
              {user?.displayName || "User"}
            </p>
            <p className="text-xs text-base-content/70">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      {/* Main Content */}
      <div className="drawer-content flex flex-col bg-base-200">
        {/* Mobile Header */}
        <header className="lg:hidden navbar bg-base-100 shadow-sm">
          <div className="flex-none">
            <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost">
              <Menu size={24} />
            </label>
          </div>
          <div className="flex-1">
            <a className="btn btn-ghost normal-case text-xl text-primary">
              {activeCompany?.name || "Dashboard"}
            </a>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side" style={{ zIndex: 40 }}>
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <div className="w-80 h-full">
          <SidebarContent />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
