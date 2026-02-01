import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';

const AdminAttendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterDate, setFilterDate] = useState('');

    useEffect(() => {
        const fetchAttendance = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/attendance');
                if (response.data.success) {
                    setAttendance(response.data.attendance);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAttendance();
    }, []);

    // Derived state for filtering
    const filteredAttendance = filterDate 
        ? attendance.filter(record => new Date(record.date).toISOString().split('T')[0] === filterDate)
        : attendance;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Attendance Overview</h2>
            
            <div className="mb-4">
                <label className="mr-2 font-semibold text-gray-700">Filter by Date:</label>
                <input 
                    type="date" 
                    value={filterDate} 
                    onChange={(e) => setFilterDate(e.target.value)} 
                    className="p-2 border border-gray-300 rounded-md"
                />
                <button 
                    onClick={() => setFilterDate('')} 
                    className="ml-2 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                    Show All
                </button>
            </div>

            <div className="bg-white overflow-hidden shadow-md sm:rounded-lg">
                 <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
                        ) : filteredAttendance.length === 0 ? (
                             <tr><td colSpan="6" className="text-center py-4">No records found</td></tr>
                        ) : (
                            filteredAttendance.map((record) => (
                                <tr key={record._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="text-sm font-medium text-gray-900">{record.employeeId?.name || 'Unknown'}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                         {record.employeeId?.department?.deptName || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(record.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            record.status === 'present' ? 'bg-green-100 text-green-800' : 
                                            record.status === 'absent' ? 'bg-red-100 text-red-800' :
                                            record.status === 'half-day' ? 'bg-yellow-100 text-yellow-800' : 
                                            record.status === 'leave' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {record.status?.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                 </table>
            </div>
        </div>
    );
};

export default AdminAttendance;
