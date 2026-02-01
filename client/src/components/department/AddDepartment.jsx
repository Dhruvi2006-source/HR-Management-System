import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';

const AddDepartment = () => {
    const [department, setDepartment] = useState({
        deptName: '',
        description: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDepartment({ ...department, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/departments/add', department);
            if(response.data.success) {
                navigate('/admin-dashboard/departments');
            }
        } catch(error) {
            if(error.response && !error.response.data.success) {
                alert(error.response.data.error)
            }
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96">
            <h2 className="text-2xl font-bold mb-6 text-center">Add New Department</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="deptName" className="block text-sm font-medium text-gray-700">Department Name</label>
                    <input 
                        type="text" 
                        name="deptName"
                        onChange={handleChange}
                        placeholder="Enter Dep Name" 
                        className="mt-1 w-full p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" 
                        required
                    />
                </div>
                <div className="mb-4">
                     <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea 
                        name="description" 
                        onChange={handleChange}
                        placeholder='Description'
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" 
                        rows="4"
                    />
                </div>
                <button type="submit" className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md">Add Department</button>
            </form>
        </div>
    );
};

export default AddDepartment;
