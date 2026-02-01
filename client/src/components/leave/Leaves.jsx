import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';

const Leaves = () => {
    const [leaves, setLeaves] = useState([]);
    
    // Form States
    const [leaveType, setLeaveType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');

    const fetchLeaves = async () => {
        try {
            const response = await axios.get('/leaves');
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/leaves/add', {
                leaveType, startDate, endDate, reason
            });
            if(response.data.success) {
                fetchLeaves();
                // Reset form
                setLeaveType('');
                setStartDate('');
                setEndDate('');
                setReason('');
                alert("Leave applied successfully");
            }
        } catch(error) {
             alert(error.response?.data?.error || "Server Error");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Manage Leaves</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Apply Leave Form */}
                <div className="bg-white p-6 rounded-md shadow-md h-fit">
                    <h3 className="text-xl font-bold mb-4">Apply for Leave</h3>
                     <form onSubmit={handleSubmit}>
                         <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Leave Type</label>
                            <select 
                                className="mt-1 w-full p-2 border rounded-md" 
                                value={leaveType} 
                                onChange={(e) => setLeaveType(e.target.value)} 
                                required
                            >
                                <option value="">Select Type</option>
                                <option value="sick">Sick Leave</option>
                                <option value="casual">Casual Leave</option>
                                <option value="paid">Paid Leave</option>
                                <option value="unpaid">Unpaid Leave</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700">From Date</label>
                                <input type="date" className="mt-1 w-full p-2 border rounded-md" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">To Date</label>
                                <input type="date" className="mt-1 w-full p-2 border rounded-md" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Reason</label>
                            <textarea className="mt-1 w-full p-2 border rounded-md" rows="3" value={reason} onChange={(e) => setReason(e.target.value)} required></textarea>
                        </div>
                        <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 w-full">Apply Leave</button>
                    </form>
                </div>

                {/* Leave History List */}
                <div className="bg-white p-6 rounded-md shadow-md">
                     <h3 className="text-xl font-bold mb-4">Leave History</h3>
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Type</th>
                                    <th className="px-6 py-3">From</th>
                                    <th className="px-6 py-3">To</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaves.map((leave) => (
                                    <tr key={leave._id} className="bg-white border-b">
                                        <td className="px-6 py-4 font-medium text-gray-900 border">{leave.leaveType.toUpperCase()}</td>
                                        <td className="px-6 py-4 border">{new Date(leave.startDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 border">{new Date(leave.endDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 border">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                leave.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {leave.status.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default Leaves;
