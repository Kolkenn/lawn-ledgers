import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { adminNavLinks } from "../../data/adminNavLinks";

const AdminMobileNav = () => {
  const { t } = useTranslation();
  const mobileNavLinks = adminNavLinks.slice(0, 5);

  return (
    <div className="lg:hidden dock dock-bottom">
      {mobileNavLinks.map(({ name, path, icon: Icon }) => (
        // Each link is now wrapped in a `dock-item` for proper styling
        <div key={path} className="dock-item">
          <NavLink
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive ? "text-primary" : "text-base-content/70"
              }`
            }
          >
            <Icon size={20} />
            <span className="text-xs mt-1">{t(name)}</span>
          </NavLink>
        </div>
      ))}
    </div>
  );
};

export default AdminMobileNav;
