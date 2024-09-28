import { useAuthStore } from '@/store/useAuthStore';
import { useLocation, Outlet, Navigate } from 'react-router-dom';

const AuthLayout = () => {
  const { isAuthenticated, loading } = useAuthStore();
  const location = useLocation();

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default AuthLayout;
