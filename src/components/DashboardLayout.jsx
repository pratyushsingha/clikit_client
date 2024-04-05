import React from 'react';
import { Sidebar } from './Index';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-12'>
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
