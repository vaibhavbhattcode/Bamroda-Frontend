import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ admin }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simulate token check
    const token = localStorage.getItem(admin ? "adminToken" : "token");

    if (token) {
      setIsAuthenticated(true);
    }

    setLoading(false); // Done checking token
  }, [admin]);

  if (loading) {
    return <div className="text-center mt-10 text-xl">Loading...</div>; // Prevent blank screen
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={admin ? "/admin/login" : "/login"}
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
