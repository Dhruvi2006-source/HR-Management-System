import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Building, Calendar, DollarSign, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
    const { logout } = useAuth();
    
    return (
        <div className="bg-gray-900 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64">
            <div className="bg-teal-600 h-16 flex items-center justify-center">
                <h3 className="text-2xl font-serif text-center font-bold">Employee MS</h3>
            </div>
            <div className="px-4">
                 <NavLink 
                    to="/admin-dashboard"
                    className={({isActive}) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded hover:bg-teal-600 hover:text-white transition duration-200`}
                    end
                 >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                 </NavLink>
                 <NavLink 
                    to="/admin-dashboard/employees"
                    className={({isActive}) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded hover:bg-teal-600 hover:text-white transition duration-200`}
                 >
                    <Users size={20} />
                    <span>Employees</span>
                 </NavLink>
                 <NavLink 
                    to="/admin-dashboard/departments"
                    className={({isActive}) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded hover:bg-teal-600 hover:text-white transition duration-200`}
                 >
                    <Building size={20} />
                    <span>Departments</span>
                 </NavLink>
                  <NavLink 
                    to="/admin-dashboard/leaves"
                    className={({isActive}) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded hover:bg-teal-600 hover:text-white transition duration-200`}
                 >
                    <Calendar size={20} />
                    <span>Leave</span>
                 </NavLink>
                 <NavLink 
                    to="/admin-dashboard/salary"
                    className={({isActive}) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded hover:bg-teal-600 hover:text-white transition duration-200`}
                 >
                    <DollarSign size={20} />
                    <span>Salary</span>
                 </NavLink>
            </div>
             <div className="absolute bottom-4 w-full px-4">
                <button
                 onClick={logout}
                 className="flex items-center space-x-4 py-2.5 px-4 rounded bg-red-600 hover:bg-red-700 hover:text-white transition duration-200 w-full"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
             </div>
        </div>
    );
};

export default AdminSidebar;
