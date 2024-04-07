import useAuth from '@/hooks/useAuth';
import { useLocation, Outlet, Navigate } from 'react-router-dom';

const AuthLayout = () => {
  const { auth } = useAuth();
  const location = useLocation();

  return auth?.user || localStorage.getItem('accessToken') ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default AuthLayout;
