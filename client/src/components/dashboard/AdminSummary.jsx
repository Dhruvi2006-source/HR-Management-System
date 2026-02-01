import React, { useEffect, useState } from 'react';
import { Users, Building, CheckCircle, FileText, XCircle, DollarSign, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axios';

const AdminSummary = () => {
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
             try {
                const summaryData = await axios.get('/dashboard/summary');
                if(summaryData.data.success) {
                    setSummary(summaryData.data.summary);
                }
             } catch(error) {
                 if(error.response) {
                     alert(error.response.data.error)
                 }
                 console.log(error.message);
             }
        }
        fetchSummary();
    }, []);

    if(!summary) {
        return <div>Loading...</div>
    }

    return (
        <div className="p-6">
            <h3 className="text-2xl font-bold mb-4">Dashboard Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Link to="/admin-dashboard/employees">
                    <SummaryCard icon={<Users />} text="Total Employees" number={summary.totalEmployees} color="bg-teal-600" />
                </Link>
                <Link to="/admin-dashboard/departments">
                    <SummaryCard icon={<Building />} text="Total Departments" number={summary.totalDepartments} color="bg-yellow-600" />
                </Link>
                <Link to="/admin-dashboard/salary">
                    <SummaryCard icon={<DollarSign />} text="Monthly Pay" number={`$${summary.totalSalary}`} color="bg-red-600" />
                </Link>
            </div>
             <div className="mt-12">
                <h4 className="text-center text-2xl font-bold">Leave Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <SummaryCard icon={<FileText />} text="Leave Applied" number={summary.leaveSummary.appliedFor} color="bg-teal-600" />
                    <SummaryCard icon={<CheckCircle />} text="Leave Approved" number={summary.leaveSummary.approved} color="bg-green-600" />
                    <SummaryCard icon={<ShieldAlert />} text="Leave Pending" number={summary.leaveSummary.pending} color="bg-yellow-600" />
                    <SummaryCard icon={<XCircle />} text="Leave Rejected" number={summary.leaveSummary.rejected} color="bg-red-600" />
                </div>
            </div>
        </div>
    );
};

const SummaryCard = ({ icon, text, number, color }) => {
    return (
        <div className="rounded flex bg-white hover:shadow-lg transition">
            <div className={`text-3xl flex items-center justify-center w-16 text-white ${color}`}>
                {icon}
            </div>
            <div className="pl-4 py-1">
                <p className="text-lg font-semibold text-gray-700">{text}</p>
                <p className="text-xl font-bold">{number}</p>
            </div>
        </div>
    )
}

export default AdminSummary;
