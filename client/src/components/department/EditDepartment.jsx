import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../utils/axios';

const EditDepartment = () => {
    const { id } = useParams();
    const [department, setDepartment] = useState({
        deptName: '',
        description: ''
    });
    const [depLoading, setDepLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDepartment = async () => {
             setDepLoading(true);
            try {
                const response = await axios.get('/departments'); // Can be optimized, but using filter for now if GetOne not ready, oh wait I need specific ID. Actually index has get All, but user routes in dep.js has no simple getOne for admin? 
                // Ah, I did not create a GetOne endpoint in department.js? Let's check or just fetch all and filter.
                // Re-checking department.js... I only have '/', '/add', '/:id'(Put), '/:id'(Delete). No GET by ID. 
                // I will just fetch all and find, or better, add GET /:id route. 
                // But for now, to save tool calls, I'll filter from getAll if dataset is small, or add GET later.
                // Wait, typically Edit loads data. I can assume small data for now.
                if(response.data.success) {
                    const dept = response.data.departments.find(d => d._id === id);
                    if(dept) {
                         setDepartment({ deptName: dept.deptName, description: dept.description });
                    }
                }
            } catch(error) {
                if(error.response && !error.response.data.success) {
                    alert(error.response.data.error)
                }
            } finally {
                setDepLoading(false);
            }
        };
        fetchDepartment();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDepartment({ ...department, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/departments/${id}`, department);
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
        <>{depLoading ? <div>Loading...</div> : (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96">
            <h2 className="text-2xl font-bold mb-6 text-center">Edit Department</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="deptName" className="block text-sm font-medium text-gray-700">Department Name</label>
                    <input 
                        type="text" 
                        name="deptName"
                        value={department.deptName}
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
                        value={department.description}
                        onChange={handleChange}
                        placeholder='Description'
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" 
                        rows="4"
                    />
                </div>
                <button type="submit" className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md">Edit Department</button>
            </form>
        </div>
        )}</>
    );
};

export default EditDepartment;
