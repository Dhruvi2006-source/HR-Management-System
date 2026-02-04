import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, CalendarCheck, Ticket } from 'lucide-react';
import axios from '../../utils/axios';

const EmployeeSummary = () => {
    const { user } = useAuth();
    const [summary, setSummary] = useState({
        present: 0,
        absent: 0,
        halfDay: 0,
        leave: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
             try {
                const response = await axios.get('/api/attendance');
                if (response.data.success) {
                    const data = response.data.attendance;
                    const stats = { present: 0, absent: 0, halfDay: 0, leave: 0 };
                    
                    data.forEach(rec => {
                        if (rec.status === 'present') stats.present++;
                        else if (rec.status === 'absent') stats.absent++;
                        else if (rec.status === 'half-day') stats.halfDay++;
                        else if (rec.status === 'leave') stats.leave++;
                    });
                    setSummary(stats);
                }
            } catch (error) {
                console.error("Error fetching summary stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);
    
    return (
        <div>
            <div className="mb-6">
                 <h2 className="text-2xl font-bold">Dashboard Overview</h2>
                 <p className="text-gray-600">Welcome back, {user && user.name}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
                    <div className="bg-teal-100 p-3 rounded-full text-teal-600">
                        <User size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Profile</h3>
                        <p className="text-gray-500 text-sm">View Details</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
                     <div className="bg-teal-100 p-3 rounded-full text-teal-600">
                        <Ticket size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Leaves Taken</h3>
                         {/* Displaying actual leaves taken */}
                        <p className="text-xl font-bold">{summary.leave}</p>
                    </div>
                </div>

                 <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
                     <div className="bg-teal-100 p-3 rounded-full text-teal-600">
                        <CalendarCheck size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Present Days</h3>
                        <p className="text-xl font-bold">{summary.present}</p>
                    </div>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                 <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                 <ul className="space-y-4">
                     <li className="flex items-center justify-between border-b pb-2">
                         <div>
                             <p className="font-semibold">Logged In</p>
                             <p className="text-sm text-gray-500">You logged into the system.</p>
                         </div>
                         <span className="text-sm text-gray-400">Just now</span>
                     </li>
                 </ul>
            </div>
        </div>
    );
};

export default EmployeeSummary;
