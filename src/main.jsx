import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import {
  AppContextProvider,
  SignupPage,
  ThemeProvider,
  App,
  LoginPage,
  HomePage
} from './components/Index';
import { Toaster } from './components/Index';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/register', element: <SignupPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/', element: <HomePage /> }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AppContextProvider>
        <RouterProvider router={router}>
          <Toaster />
        </RouterProvider>
      </AppContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
