import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarCheck, CalendarDays, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const EmployeeSidebar = () => {
    const { logout } = useAuth();

    return (
        <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64">
            <div className="bg-teal-600 h-12 flex items-center justify-center">
                <h3 className="text-2xl text-center font-pacific">Employee MS</h3>
            </div>
            <div className="px-4">
               {/* <p>Welcome, {user.name}</p> */}
               <NavLink to="/employee-dashboard" 
                    className={({ isActive }) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 block py-2.5 px-4 rounded transition duration-200 hover:bg-teal-500 hover:text-white`}
                    end
                >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/employee-dashboard/profile" 
                    className={({ isActive }) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 block py-2.5 px-4 rounded transition duration-200 hover:bg-teal-500 hover:text-white`}
                >
                    <User size={20} />
                    <span>My Profile</span>
                </NavLink>

                 <NavLink to="/employee-dashboard/leaves" 
                    className={({ isActive }) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 block py-2.5 px-4 rounded transition duration-200 hover:bg-teal-500 hover:text-white`}
                >
                    <CalendarDays size={20} />
                    <span>Leaves</span>
                </NavLink>

                 <NavLink to="/employee-dashboard/attendance" 
                    className={({ isActive }) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 block py-2.5 px-4 rounded transition duration-200 hover:bg-teal-500 hover:text-white`}
                >
                    <CalendarCheck size={20} />
                    <span>Attendance</span>
                </NavLink>
            </div>
             <div className="absolute bottom-4 w-full px-4">
                <button
                 onClick={logout}
                 className="flex items-center space-x-4 py-2.5 px-4 rounded bg-red-600 hover:bg-red-700 hover:text-white transition duration-200 w-full"
                >
                     {/* We can import LogOut icon if needed or just use text */}
                    <span>Logout</span>
                </button>
             </div>
        </div>
    );
};

export default EmployeeSidebar;
