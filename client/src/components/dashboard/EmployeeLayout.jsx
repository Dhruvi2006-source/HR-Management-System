import React from 'react';
import { Outlet } from 'react-router-dom';
import EmployeeSidebar from './EmployeeSidebar';
import Navbar from '../Navbar';

const EmployeeLayout = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            <EmployeeSidebar />
            <div className="flex-1 ml-64 flex flex-col h-screen">
                 <Navbar /> {/* Using the existing public navbar for now, or we can create a specific header */}
                <div className="p-6 flex-1 overflow-y-auto">
                     <Outlet />
                </div>
            </div>
        </div>
    );
};

export default EmployeeLayout;
