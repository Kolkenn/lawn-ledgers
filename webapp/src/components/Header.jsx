import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';

import LanguageSwitcher from './LanguageSwitcher';
import { handleLogout } from '../firebase/authService';

const Header = ({ user, companyProfile }) => {
  const { t } = useTranslation();
  const location = useLocation();

  // A helper function to get the page title based on the current path
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return t('pageTitles.dashboard');
      case '/settings':
        return t('pageTitles.settings');
      default:
        return ''; // Or a default title
    }
  };

  const pageTitle = getPageTitle();

  return (
    <header className="bg-white border-b border-gray-200 p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {/* Conditionally render the logo if the URL exists */}
          {companyProfile?.logoUrl && (
            <img 
              src={companyProfile.logoUrl} 
              alt={`${companyProfile.companyName} logo`}
              className="w-8 h-8 rounded-md object-contain mr-3"
            />
          )}
          <h1 className="text-xl font-semibold text-gray-800">
            {companyProfile?.companyName}
            {pageTitle && <span className="text-gray-400 font-normal"> - {pageTitle}</span>}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <LanguageSwitcher />
          <button
            onClick={handleLogout}
            className="cursor-pointer w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-full hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            aria-label={t('logOut')}
          >
            <LogOut />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;