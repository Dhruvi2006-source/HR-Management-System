import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';

const ViewProfile = () => {
    const { user } = useAuth();
    const [employee, setEmployee] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        address: '',
        phone: ''
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await axios.get(`/api/employees/${user._id}`);
                if (response.data.success) {
                    setEmployee(response.data.employee);
                    setFormData({
                        address: response.data.employee.address || '',
                        phone: response.data.employee.phone || ''
                    });
                }
            } catch (error) {
                console.error("Error fetching profile", error);
            }
        };
        if(user) fetchEmployee();
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('address', formData.address);
        data.append('phone', formData.phone);
        if (profilePicture) {
            data.append('profilePicture', profilePicture);
        }

        try {
            const response = await axios.put(`/api/employees/${employee._id}/profile`, data);
            if (response.data.success) {
                setEmployee(response.data.employee);
                setIsEditing(false);
                setPreviewUrl(null); // Clear preview as the main image will update
            }
        } catch (error) {
            console.error("Error updating profile", error);
            alert(error.response?.data?.error || "Failed to update profile");
        }
    };

    if (!employee) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">My Profile</h2>
            
            <div className={`grid grid-cols-1 ${isEditing ? 'gap-8' : 'md:grid-cols-2 gap-6'}`}>
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center justify-center">
                    <div className="relative">
                        <img 
                            src={previewUrl || `/uploads/${employee.profilePicture}`} 
                            alt="Profile" 
                            className="w-48 h-48 rounded-full object-cover border-4 border-teal-600 shadow-lg"
                        />
                        {isEditing && (
                            <label htmlFor="profilePicture" className="absolute bottom-0 right-0 bg-teal-600 text-white p-2 rounded-full cursor-pointer hover:bg-teal-700 transition">
                                <span className="material-icons text-sm">edit</span>
                                <input 
                                    type="file" 
                                    id="profilePicture" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </label>
                        )}
                    </div>
                </div>

                {/* Details Section */}
                <div className='space-y-6'>
                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 border p-2"
                                    placeholder="Enter phone number"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 border p-2"
                                    rows="3"
                                    placeholder="Enter address"
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                             {/* Personal Details */}
                            <div className="bg-gray-50 p-4 rounded-md">
                                <h3 className="text-lg font-semibold mb-3 text-teal-700 border-b pb-1">Personal Details</h3>
                                <div className="grid grid-cols-1 gap-2">
                                    <div className="flex justify-between border-b pb-1">
                                        <span className="font-medium text-gray-600">Name:</span>
                                        <span className="text-gray-800">{employee.name}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-1">
                                        <span className="font-medium text-gray-600">Date of Birth:</span>
                                        <span className="text-gray-800">{new Date(employee.dob).toLocaleDateString()}</span>
                                    </div>
                                     <div className="flex justify-between border-b pb-1">
                                        <span className="font-medium text-gray-600">Gender:</span>
                                        <span className="text-gray-800">{employee.gender || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-1">
                                        <span className="font-medium text-gray-600">Address:</span>
                                        <span className="text-gray-800">{employee.address || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-600">Phone:</span>
                                        <span className="text-gray-800">{employee.phone || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Job Details */}
                            <div className="bg-gray-50 p-4 rounded-md">
                                <h3 className="text-lg font-semibold mb-3 text-teal-700 border-b pb-1">Job Details</h3>
                                 <div className="grid grid-cols-1 gap-2">
                                     <div className="flex justify-between border-b pb-1">
                                        <span className="font-medium text-gray-600">Employee ID:</span>
                                        <span className="text-gray-800">{employee.employeeId}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-1">
                                        <span className="font-medium text-gray-600">Department:</span>
                                        <span className="text-gray-800">{employee.department?.deptName || "N/A"}</span>
                                    </div>
                                     <div className="flex justify-between border-b pb-1">
                                        <span className="font-medium text-gray-600">Designation:</span>
                                        <span className="text-gray-800">{employee.designation}</span>
                                    </div>
                                     <div className="flex justify-between">
                                        <span className="font-medium text-gray-600">Total Salary:</span>
                                        <span className="text-gray-800">${employee.salary}</span>
                                    </div>
                                 </div>
                            </div>

                             {/* Documents Section (Placeholder) */}
                             <div className="bg-gray-50 p-4 rounded-md">
                                <h3 className="text-lg font-semibold mb-3 text-teal-700 border-b pb-1">Documents</h3>
                                <p className="text-gray-500 italic">No documents uploaded.</p>
                             </div>

                             <div className="mt-6 flex justify-end">
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded transition duration-200"
                                >
                                    Edit Profile
                                </button>
                             </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewProfile;
