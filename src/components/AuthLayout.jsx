import { useAuthStore } from '@/store/useAuthStore';
import { useEffect } from 'react';
import { useLocation, Outlet, useNavigate, Navigate } from 'react-router-dom';
import { Spinner } from './Index';

const AuthLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, authloader, authStatus } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    authStatus();
  }, [authStatus]);

  useEffect(() => {
    if (!authloader) {
      if (
        isAuthenticated &&
        (location.pathname === '/login' || location.pathname === '/register')
      ) {
        navigate('/dashboard');
      } else if (!isAuthenticated) {
        navigate('/login');
      }
    }
  }, [location.pathname, navigate]);

  if (authloader) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default AuthLayout;
