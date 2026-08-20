import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading, hasRole } = useAuth();

  if (loading) {
    // You can replace this with your Lottie Loader later!
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // Not logged in? Kick them to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in, but wrong role? Kick them to their default dashboard
  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  // If everything is good, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;