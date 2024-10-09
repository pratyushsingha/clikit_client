import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';

import './index.css';
import { Container } from '@/components/Index';
import Navbar from './components/Navbar';
import { useAuthStore } from './store/useAuthStore';

const App = () => {
  const { authStatus, progress, setProgress, currentUser } = useAuthStore();

  useEffect(() => {
    authStatus();
  }, [authStatus]);

  useEffect(() => {
    currentUser();
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
