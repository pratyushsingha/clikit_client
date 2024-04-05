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
  HomePage,
  DashboardPage,
  SettingPage
} from './components/Index';
// import { Toaster } from './components/Index';
import DashboardLayout from './components/DashboardLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/register', element: <SignupPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/', element: <HomePage /> },
      {
        path: '/dashboard',
        element: <DashboardLayout />,
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />
          },
          {
            path: '/dashboard/settings',
            element: <SettingPage />
          }
        ]
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AppContextProvider>
        <RouterProvider router={router}>
          {/* <Toaster /> */}
        </RouterProvider>
      </AppContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
