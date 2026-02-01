import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../utils/axios';

const EditEmployee = () => {
    const { id } = useParams();
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        employeeId: '',
        dob: '',
        gender: '',
        maritalStatus: '',
        designation: '',
        department: '',
        salary: 0,
        address: '',
        phone: '',
        role: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDepartments = async () => {
             try {
                const response = await axios.get('/api/departments');
                if(response.data.success) {
                   setDepartments(response.data.departments);
                }
            } catch(error) {
                console.error(error);
            }
        };

        const fetchEmployee = async () => {
             try {
                const response = await axios.get(`/api/employees/${id}`);
                if(response.data.success) {
                    const emp = response.data.employee;
                    setFormData({
                        name: emp.name,
                        email: emp.email,
                        employeeId: emp.employeeId,
                        dob: emp.dob ? new Date(emp.dob).toISOString().split('T')[0] : '',
                        gender: emp.gender,
                        maritalStatus: emp.maritalStatus,
                        designation: emp.designation,
                        department: emp.department?._id || emp.department || '', // Handle populated, ID, or null
                        salary: emp.salary,
                        address: emp.address || '',
                        phone: emp.phone || '',
                        role: emp.role
                    });
                }
            } catch(error) {
                console.error(error);
            }
        };

        fetchDepartments();
        fetchEmployee();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/api/employees/${id}`, formData);
            if(response.data.success) {
                navigate('/admin-dashboard/employees');
            }
        } catch(error) {
            if(error.response && !error.response.data.success) {
                alert(error.response.data.error)
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Edit Employee</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {/* Name */}
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder='Insert Name' className="mt-1 w-full p-2 block w-full border border-gray-300 rounded-md" required />
                     </div>
                      {/* Email (Read Only usually) */}
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" value={formData.email} disabled className="mt-1 w-full p-2 block w-full border border-gray-300 rounded-md bg-gray-100" />
                     </div>
                      {/* Employee ID */}
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                        <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} placeholder='Employee ID' className="mt-1 w-full p-2 block w-full border border-gray-300 rounded-md" required />
                     </div>
                      {/* Date of Birth */}
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="mt-1 w-full p-2 block w-full border border-gray-300 rounded-md" required />
                     </div>
                      {/* Gender */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} className="mt-1 w-full p-2 block w-full border border-gray-300 rounded-md" required>
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                     </div>
                      {/* Marital Status */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                         <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="mt-1 w-full p-2 block w-full border border-gray-300 rounded-md" required>
                            <option value="">Select Status</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                        </select>
                     </div>
                      {/* Designation */}
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Designation</label>
                        <input type="text" name="designation" value={formData.designation} onChange={handleChange} placeholder='Designation' className="mt-1 w-full p-2 block w-full border border-gray-300 rounded-md" required />
                     </div>
                      {/* Department */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Department</label>
                        <select name="department" value={formData.department} onChange={handleChange} className="mt-1 w-full p-2 block w-full border border-gray-300 rounded-md" required>
                            <option value="">Select Department</option>
                            {departments.map(dept => (
                                <option key={dept._id} value={dept._id}>{dept.deptName}</option>
                            ))}
                        </select>
                     </div>
                      {/* Salary */}
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Salary</label>
                        <input type="number" name="salary" value={formData.salary} onChange={handleChange} placeholder='Salary' className="mt-1 w-full p-2 block w-full border border-gray-300 rounded-md" required />
                     </div>
                      {/* Address */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder='Address' className="mt-1 w-full p-2 block w-full border border-gray-300 rounded-md" />
                     </div>
                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder='Phone' className="mt-1 w-full p-2 block w-full border border-gray-300 rounded-md" />
                     </div>
                      {/* Role */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                         <select name="role" value={formData.role} onChange={handleChange} className="mt-1 w-full p-2 block w-full border border-gray-300 rounded-md" required>
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="employee">Employee</option>
                        </select>
                     </div>
                </div>

                <button type="submit" className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md">Update Employee</button>
            </form>
        </div>
    );
};

export default EditEmployee;
