import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";

import LanguageSwitcher from "./LanguageSwitcher";
import { handleLogout } from "../firebase/authService";

const Header = ({ companyProfile }) => {
  const { t } = useTranslation();
  const location = useLocation();

  // A helper function to get the page title based on the current path
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return t("pageTitles.dashboard");
      case "/settings":
        return t("pageTitles.settings");
      default:
        return ""; // Or a default title
    }
  };

  const pageTitle = getPageTitle();

  return (
    <header className="bg-white border-b border-gray-200 p-4">
      <div className="flex justify-between items-center">
        {/* Logo - Company Name - Current Page Container */}
        <div className="flex items-center">
          {/* Logo */}
          {companyProfile?.logoUrl && (
            <img
              src={companyProfile.logoUrl}
              alt={`${companyProfile.name} logo`}
              className="w-20 h-10 rounded-md object-contain mr-3"
            />
          )}
          {/* Name - Current Page */}
          <h1 className="text-xl font-semibold text-gray-800">
            {companyProfile?.name}
            {pageTitle && (
              <span className="text-gray-400 font-normal"> - {pageTitle}</span>
            )}
          </h1>
        </div>
        {/* Quick Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Language Selector */}
          <LanguageSwitcher />
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="cursor-pointer w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-full hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            aria-label={t("logOut")}
            title={t("logOut")}
          >
            <LogOut />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
