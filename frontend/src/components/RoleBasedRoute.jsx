import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuthStore();

  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const redirectPath = user?.role === 'admin' ? '/admin' : '/customer';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default RoleBasedRoute;
