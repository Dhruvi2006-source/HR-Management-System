import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/auth/login', { email, password });
            if (response.data.success) {
                login(response.data.user);
                localStorage.setItem('token', response.data.token);
                if (response.data.user.role === 'admin') {
                    navigate('/admin-dashboard');
                } else {
                    navigate('/employee-dashboard');
                }
            }
        } catch (error) {
           setError(error.response?.data?.error || "Server Error");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 min-h-screen">
             <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-white shadow-lg border border-gray-200">
                <h1 className="text-2xl font-bold text-center text-teal-600">HRMS Login</h1>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input 
                            type="email" 
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder='admin@example.com'
                         />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input 
                            type="password" 
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder='******'
                        />
                    </div>
                    <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-teal-600 rounded hover:bg-teal-700 focus:outline-none focus:bg-teal-700">
                        Login
                    </button>
                </form>
                <div className="text-center mt-4">
                    <span className="text-gray-600 text-sm">Don't have an account? </span>
                    <Link to="/register" className="text-teal-600 hover:text-teal-800 text-sm">Register</Link>
                </div>
             </div>
        </div>
    );
};

export default Login;
