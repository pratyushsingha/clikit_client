import { useAuthStore } from '@/store/useAuthStore';
import { useEffect } from 'react';
import { useLocation, Outlet, useNavigate, Navigate } from 'react-router-dom';
import { Spinner } from './Index';

const AuthLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading, authStatus } = useAuthStore();
  const location = useLocation();

  if (loading) <Spinner />;

  useEffect(() => {
    isAuthenticated && location.pathname === '/login'
      ? navigate('/dashboard')
      : navigate('/login');
  }, [authStatus, isAuthenticated, location.pathname, navigate]);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AuthLayout;
