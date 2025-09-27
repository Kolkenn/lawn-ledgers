import { useAuth } from "../../context/AuthContext";
import { handleLogout } from "../../firebase/authService";

const CrewHeader = () => {
  const { user } = useAuth();

  return (
    <header className="flex-shrink-0 flex items-center justify-between p-4 bg-base-100 shadow">
      <div className="font-bold text-lg">Today's Jobs</div>
      <button onClick={handleLogout} className="btn btn-ghost btn-sm">
        Log Out
      </button>
    </header>
  );
};

export default CrewHeader;
