import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { Link } from 'react-router-dom';

const SalaryList = () => {
    const [filterSalary, setFilterSalary] = useState([]);

    useEffect(() => {
        const fetchSalaries = async () => {
            try {
                // We'll use the 'dashboard salary' call or maybe just get employees?
                // The /api/salary/ logic returns list of Users.
                const response = await axios.get('/salary'); 
                if (response.data.success) {
                    setFilterSalary(response.data.employees); 
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchSalaries();
    }, []);

    // Filter Logic if needed (by department)

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Salary Management</h2>
                <Link to="/admin-dashboard/salary/add" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">Add Salary/Payroll</Link>
            </div>

            <div className="bg-white overflow-hidden shadow-md sm:rounded-lg">
                 <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SNO</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary (Basic)</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allowances/Deductions</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filterSalary.map((emp, index) => (
                           <tr key={emp._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{emp.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">${emp.salary}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500 italic">View Details</td> 
                                <td className="px-6 py-4 whitespace-nowrap">{emp.TotalSalary || "-"}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {/* Action to View History or Pay */}
                                     <button className="text-blue-600 hover:text-blue-900 mr-2">History</button>
                                     <button className="text-green-600 hover:text-green-900">Edit</button>
                                </td>
                           </tr>
                        ))}
                    </tbody>
                 </table>
            </div>
        </div>
    );
};

export default SalaryList;
