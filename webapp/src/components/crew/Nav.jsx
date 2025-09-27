import { NavLink } from "react-router-dom";
import { Clipboard, Clock, User } from "lucide-react";

const CrewNav = () => {
  const navLinks = [
    { name: "Today's Jobs", path: "/jobs", icon: Clipboard },
    { name: "Clock In/Out", path: "/timeclock", icon: Clock },
    { name: "My Profile", path: "/profile", icon: User },
  ];

  return (
    <nav className="btm-nav bg-base-100 border-t border-base-300">
      {navLinks.map((link) => (
        <NavLink
          key={link.name}
          to={link.path}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <link.icon size={20} />
          <span className="btm-nav-label text-xs">{link.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default CrewNav;
