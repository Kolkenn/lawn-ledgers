import { NavLink } from "react-router-dom";
import { Home, Calendar, Users } from "lucide-react";

const AdminMobileNav = () => {
  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Schedule", path: "/schedule", icon: Calendar },
    { name: "Clients", path: "/clients", icon: Users },
  ];

  return (
    <div className="md:hidden dock dock-bottom">
      {navLinks.map((link) => (
        // Each link is now wrapped in a `dock-item` for proper styling
        <div key={link.name} className="dock-item">
          <NavLink
            to={link.path}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive ? "text-primary" : "text-base-content/70"
              }`
            }
          >
            <link.icon size={20} />
            <span className="text-xs mt-1">{link.name}</span>
          </NavLink>
        </div>
      ))}
    </div>
  );
};

export default AdminMobileNav;
