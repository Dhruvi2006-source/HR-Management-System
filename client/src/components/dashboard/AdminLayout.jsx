import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminSummary from './AdminSummary';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex">
        <AdminSidebar />
        <div className="flex-1 ml-64 bg-gray-100 h-screen">
            <div className='p-4 shadow-md bg-white flex justify-between items-center'>
                 <h3 className='text-xl font-bold'>Welcome {user.name}</h3>
            </div>
            <div className="p-6">
                 <Outlet />
            </div>
        </div>
    </div>
  );
};

export default AdminLayout;
