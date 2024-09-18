import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';

import './index.css';
import { Container } from '@/components/Index';
import Navbar from './components/Navbar';
import { useAuthStore } from './store/useAuthStore';
import axios from 'axios';
import { useCurrentUser } from './hooks/useCurrentUser';

const App = () => {
  const { setIsAuthenticated, setLoading, progress, setProgress } =
    useAuthStore();
  const { fetchCurrentUser } = useCurrentUser();

  const authStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/users/auth-status`,
        {
          withCredentials: true
        }
      );
      console.log(response.data.data.isAuthenticated);
      setIsAuthenticated(response.data.data.isAuthenticated);
      setLoading(false);
    } catch (error) {
      console.error('authStatus error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    authStatus();
  }, [setIsAuthenticated]);

  useEffect(() => {
    fetchCurrentUser();
  }, []);
  return (
    <>
      <LoadingBar
        color="#22C55E"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        shadow="true"
        className="pb-1"
      />
      <Navbar />
      <Container>
        <Outlet />
      </Container>
    </>
  );
};

export default App;
