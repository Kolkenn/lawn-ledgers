import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import LogoutIcon from './icons/LogoutIcon';
import { handleLogout } from '../firebase/authService';

const Header = ({ user, companyProfile }) => {
  const { t } = useTranslation();

  return (
    <header className="bg-white border-b border-gray-200 p-4">
      <div className="flex justify-between items-center">
        {/* We can make this title dynamic in the future */}
        <h1 className="text-xl font-semibold text-gray-800">
          {companyProfile?.companyName || t('yourDashboard')}
        </h1>
        <div className="flex items-center space-x-2">
          <LanguageSwitcher />
          <button
            onClick={handleLogout}
            className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-full hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            aria-label={t('logOut')}
          >
            <LogoutIcon />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;