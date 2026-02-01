import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';

const AdminLeaveList = () => {
    const [leaves, setLeaves] = useState([]);
    const [filter, setFilter] = useState('pending');
    const fetchLeaves = async () => {
        try {
            const response = await axios.get('/api/leaves');
            if (response.data.success) {
                setLeaves(response.data.leaves);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const filteredLeaves = filter === 'all' ? leaves : leaves.filter(leave => leave.status === filter);

    const handleAction = async (id, status) => {
        const comment = prompt("Enter a comment (optional):");
        try {
            const response = await axios.put(`/api/leaves/${id}`, { status, adminComment: comment });
            if(response.data.success) {
                fetchLeaves();
            }
        } catch(error) {
             alert(error.response?.data?.error || "Server Error");
        }
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Manage Leaves</h2>

            <div className="flex space-x-4 mb-4">
                 <button onClick={() => setFilter('pending')} className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}>Pending</button>
                 <button onClick={() => setFilter('approved')} className={`px-4 py-2 rounded ${filter === 'approved' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}>Approved</button>
                 <button onClick={() => setFilter('rejected')} className={`px-4 py-2 rounded ${filter === 'rejected' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}>Rejected</button>
                 <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}>All</button>
            </div>

            <div className="bg-white overflow-hidden shadow-md sm:rounded-lg">
                 <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredLeaves.map((leave) => (
                            <tr key={leave._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                         <img src={`/uploads/${leave.employeeId?.profilePicture}`} alt="" className="w-10 h-10 rounded-full" />
                                         <div className="ml-4">
                                             <div className="text-sm font-medium text-gray-900">{leave.employeeId?.name}</div>
                                             <div className="text-sm text-gray-500">{leave.employeeId?.department?.deptName}</div>
                                         </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.leaveType.toUpperCase()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate" title={leave.reason}>{leave.reason}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        leave.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                        leave.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {leave.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {leave.status === 'pending' && (
                                        <div className='flex space-x-2'>
                                            <button onClick={() => handleAction(leave._id, 'approved')} className="text-green-600 hover:text-green-900">Approve</button>
                                            <button onClick={() => handleAction(leave._id, 'rejected')} className="text-red-600 hover:text-red-900">Reject</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
            </div>
        </div>
    );
};

export default AdminLeaveList;
