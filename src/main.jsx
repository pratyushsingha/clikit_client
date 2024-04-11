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
  SettingPage,
  Toaster,
  DashboardLayout,
  AuthProvider,
  AuthLayout,
  AnalyticsPage
} from './components/Index';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/register', element: <SignupPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/', element: <HomePage /> },
      {
        element: <AuthLayout />,
        children: [
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
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: '/dashboard/analytics/:id',
            element: <AnalyticsPage />
          }
        ]
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <AuthProvider>
      <AppContextProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AppContextProvider>
    </AuthProvider>
  </ThemeProvider>
);
