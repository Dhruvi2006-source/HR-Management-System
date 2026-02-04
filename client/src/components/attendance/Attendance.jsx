import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';

const Attendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [status, setStatus] = useState(null); 
    const [loading, setLoading] = useState(false);

    const [summary, setSummary] = useState({
        present: 0,
        absent: 0,
        halfDay: 0,
        leave: 0
    });

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/attendance');
            if (response.data.success) {
                const data = response.data.attendance;
                setAttendance(data);
                
                // Calculate Summary 
                const stats = { present: 0, absent: 0, halfDay: 0, leave: 0 };
                data.forEach(rec => {
                    if (rec.status === 'present') stats.present++;
                    else if (rec.status === 'absent') stats.absent++;
                    else if (rec.status === 'half-day') stats.halfDay++;
                    else if (rec.status === 'leave') stats.leave++;
                });
                setSummary(stats);

                // Determine current status
                const today = new Date().toISOString().split('T')[0];
                const todayRecord = data.find(a => new Date(a.date).toISOString().split('T')[0] === today);
                
                if (todayRecord) {
                    if (todayRecord.checkOutTime) {
                        setStatus('out'); 
                    } else {
                        setStatus('in'); 
                    }
                } else {
                    setStatus(null); 
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    const handleAttendanceAction = async () => {
         try {
            const response = await axios.post('/api/attendance/mark');
            if(response.data.success) {
                alert(response.data.message);
                fetchAttendance();
            }
        } catch(error) {
             alert(error.response?.data?.error || "Server Error");
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
             <div className="flex justify-between items-center mb-6">
                <div>
                     <h2 className="text-2xl font-bold text-gray-800">Attendance Overview</h2>
                     <p className="text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                 
                 <div className="flex flex-col items-end space-y-2">
                     <button 
                        onClick={handleAttendanceAction} 
                        className={`px-6 py-3 rounded-full text-white font-bold shadow-lg transition transform hover:scale-105 ${
                            status === 'in' 
                            ? 'bg-red-500 hover:bg-red-600 shadow-red-500/50' 
                            : status === 'out'
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-teal-500 hover:bg-teal-600 shadow-teal-500/50'
                        }`}
                        disabled={status === 'out'}
                    >
                        {status === 'in' ? 'Check Out' : status === 'out' ? 'Today Complete' : 'Check In'}
                     </button>
                     {status === 'in' && <span className="text-xs text-green-600 font-semibold animate-pulse">● Currently Checked In</span>}
                 </div>
            </div>

            {/* Attendance Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                    <p className="text-gray-500 text-sm">Days Present</p>
                    <p className="text-2xl font-bold text-gray-800">{summary.present}</p>
                </div>
                 <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
                    <p className="text-gray-500 text-sm">Days Absent</p>
                     <p className="text-2xl font-bold text-gray-800">{summary.absent}</p>
                </div>
                 <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
                    <p className="text-gray-500 text-sm">Half Days</p>
                     <p className="text-2xl font-bold text-gray-800">{summary.halfDay}</p>
                </div>
                 <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                    <p className="text-gray-500 text-sm">Leaves Taken</p>
                     <p className="text-2xl font-bold text-gray-800">{summary.leave}</p>
                </div>
            </div>

            {/* Attendance History Table */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                 <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                    <span className="material-icons mr-2 text-teal-600">history</span>
                    Recent Activity
                 </h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 rounded-tl-lg">Date</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Check In</th>
                                <th className="px-6 py-3">Check Out</th>
                                <th className="px-6 py-3 rounded-tr-lg">Total Hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
                            ) : attendance.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-4">No records found</td></tr>
                            ) : (
                                attendance.map((record) => {
                                    // Calculate hours for display
                                    let hours = 'N/A';
                                    if(record.checkInTime && record.checkOutTime) {
                                         const diff = new Date(record.checkOutTime) - new Date(record.checkInTime);
                                         hours = (diff / (1000 * 60 * 60)).toFixed(2) + ' hrs';
                                    }

                                    return (
                                    <tr key={record._id} className="bg-white border-b hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-900 border-b">
                                            {new Date(record.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 border-b">
                                             <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                record.status === 'present' ? 'bg-green-100 text-green-800' : 
                                                record.status === 'absent' ? 'bg-red-100 text-red-800' :
                                                record.status === 'half-day' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-blue-100 text-blue-800'
                                            }`}>
                                                {record.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 border-b text-gray-600">
                                            {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}
                                        </td>
                                        <td className="px-6 py-4 border-b text-gray-600">
                                            {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}
                                        </td>
                                        <td className="px-6 py-4 border-b font-semibold text-gray-700">
                                            {hours}
                                        </td>
                                    </tr>
                                )})
                            )}
                        </tbody>
                    </table>
                 </div>
            </div>
        </div>
    );
};

export default Attendance;
