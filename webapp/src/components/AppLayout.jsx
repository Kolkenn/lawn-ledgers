import { NavLink, Outlet } from 'react-router-dom';
import Header from './Header';
import { DashboardIcon, SettingsIcon } from './icons/NavigationIcons';

const AppLayout = (user, companyProfile) => {
  // This is a helper component for our navigation links
  const NavItem = ({ to, icon, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-2 text-gray-700 rounded-lg transition-colors ${
          isActive
            ? 'bg-green-200 text-green-800 font-bold'
            : 'hover:bg-gray-200'
        }`
      }
    >
      {icon}
      <span className="ml-3">{children}</span>
    </NavLink>
  );

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold text-green-700">LawnLedgers</h1>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          <NavItem to="/" icon={<DashboardIcon />}>Dashboard</NavItem>
          <NavItem to="/settings" icon={<SettingsIcon />}>Settings</NavItem>
          {/* Future navigation links will go here */}
        </nav>
      </aside>

      {/* Main Content */}
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