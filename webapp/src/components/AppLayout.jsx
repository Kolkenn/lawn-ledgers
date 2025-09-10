import { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import { DashboardIcon, SettingsIcon, CollapseIcon, ExpandIcon } from './icons/Icons';

const AppLayout = ({ user, companyProfile }) => {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState === 'true') {
      setIsCollapsed(true);
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', newState);
  };

  const NavItem = ({ to, icon, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-2 rounded-lg transition-colors ${ isCollapsed ? 'justify-center' : '' } ${
          isActive
            ? 'bg-green-100 text-green-800 font-bold'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`
      }
    >
      <div className="flex-shrink-0">{icon}</div>
      {!isCollapsed && (
        <span className="ml-3 whitespace-nowrap overflow-hidden">
          {children}
        </span>
      )}
    </NavLink>
  );

  return (
    <div className="flex h-screen bg-slate-100">
      <aside 
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className={`p-4 border-b flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <h1 className={`text-2xl font-bold text-green-700 whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0' : 'w-auto'}`}>
            LawnLedgers
          </h1>
          <button 
            onClick={toggleSidebar} 
            className="p-1.5 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
            aria-label={isCollapsed ? t('expandSidebar') : t('collapseSidebar')}
          >
            {isCollapsed ? <ExpandIcon /> : <CollapseIcon />}
          </button>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          <NavItem to="/" icon={<DashboardIcon />}>{t('pageTitles.dashboard')}</NavItem>
          <NavItem to="/settings" icon={<SettingsIcon />}>{t('pageTitles.settings')}</NavItem>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} companyProfile={companyProfile} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;