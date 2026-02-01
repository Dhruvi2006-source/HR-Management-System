import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user } = useAuth();
    
    return (
        <nav className="bg-teal-600 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold font-serif">Employee MS</Link>
                <div className='flex items-center space-x-4'>
                    {!user ? (
                        <>
                            <Link to="/login" className="hover:text-gray-200">Login</Link>
                            <Link to="/register" className="hover:text-gray-200">Register</Link>
                        </>
                    ) : ( 
                        <Link to={user.role === 'admin' ? '/admin-dashboard' : '/employee-dashboard'} className="hover:text-gray-200">Dashboard</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
