import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import {
  SignupPage,
  ThemeProvider,
  App,
  LoginPage,
  HomePage,
  DashboardPage,
  SettingPage,
  Toaster,
  DashboardLayout,
  AuthLayout,
  AnalyticsPage
} from './components/Index';
import CustomDomainPage from './pages/CustomDomainPage';
import ManageDomain from './pages/ManageDomain';
import PricingPage from './pages/PricingPage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/register', element: <SignupPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/', element: <HomePage /> },
      { path: '/forget-password', element: <ForgotPassword /> },
      { path: '/reset-password', element: <ResetPassword /> },
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
              },
              {
                path: '/dashboard/custom-domains',
                element: <CustomDomainPage />
              },
              {
                path: '/dashboard/custom-domains/:domainId',
                element: <ManageDomain />
              }
            ]
          },
          {
            path: '/dashboard/analytics/:id',
            element: <AnalyticsPage />
          },
          { path: '/pricing', element: <PricingPage /> },
          { path: '/payment-success', element: <PaymentSuccess /> },
          { path: '/payment-failed', element: <PaymentFailed /> }
        ]
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <RouterProvider router={router} />
    <Toaster />
  </ThemeProvider>
);
