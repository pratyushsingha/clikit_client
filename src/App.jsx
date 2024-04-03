import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';

import './index.css';
import { Container, AppContext } from '@/components/Index';
import Navbar from './components/Navbar';

const App = () => {
  const { progress, setProgress } = useContext(AppContext);
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
