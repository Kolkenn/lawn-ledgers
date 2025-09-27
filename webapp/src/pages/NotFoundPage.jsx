import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <AlertTriangle className="w-16 h-16 text-warning mb-4" />
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl mt-2">Oops! Page Not Found.</p>
      <p className="text-base-content/70 mt-1">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/dashboard" className="btn btn-primary mt-6">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
