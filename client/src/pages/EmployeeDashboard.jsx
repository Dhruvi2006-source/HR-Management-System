import React from 'react';
import { useAuth } from '../context/AuthContext';

const EmployeeDashboard = () => {
    const { user, logout } = useAuth();
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Employee Dashboard</h1>
                 <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
            </div>
             <p>Welcome, {user && user.name}</p>
             {/* Add more employee widgets here */}
        </div>
    );
};

export default EmployeeDashboard;
