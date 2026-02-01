import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'admin',
        employeeId: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', formData);
            if(response.data.success) {
                navigate('/login');
            }
        } catch(err) {
            if(err.response && !err.response.data.success) {
                setError(err.response.data.error);
            } else {
                setError("Server Error");
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-teal-600 font-roboto">
           <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Registration</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="name">Name</label>
                        <input type="text" name="name" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Enter Name" onChange={handleChange} required />
                    </div>
                     <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="email">Email</label>
                        <input type="email" name="email" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Enter Email" onChange={handleChange} required />
                    </div>
                     <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="employeeId">Employee ID</label>
                        <input type="text" name="employeeId" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Enter Employee ID" onChange={handleChange} required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="password">Password</label>
                        <input type="password" name="password" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Enter Password" onChange={handleChange} required />
                    </div>
                    <div className="mb-4">
                         <label className="block text-gray-700" htmlFor="confirmPassword">Confirm Password</label>
                         <input type="password" name="confirmPassword" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Confirm Password" onChange={handleChange} required />
                    </div>
                    
                    <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 mb-4">Register</button>
                    
                     <div className="text-center">
                        <span className="text-gray-600">Already have an account? </span>
                        <Link to="/login" className="text-teal-600 hover:text-teal-800">Login</Link>
                    </div>
                </form>
           </div>
        </div>
    );
};

export default Register;
