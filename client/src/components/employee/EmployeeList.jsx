import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { columns, EmployeeButtons } from '../../utils/EmployeeHelper';
import axios from '../../utils/axios';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [empLoading, setEmpLoading] = useState(false);
    const [filterEmployees, setFilterEmployees] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            setEmpLoading(true);
            try {
                const response = await axios.get('/employees');
                if(response.data.success) {
                    let sno = 1;
                    const data = await response.data.employees.map(emp => ({
                       _id: emp._id,
                       sno: sno++,
                       deptName: emp.department?.deptName || "N/A",
                       name: emp.name,
                       dob: new Date(emp.dob).toLocaleDateString(),
                       profilePicture: <img src={`/${emp.profilePicture}`} alt="" className="w-10 h-10 rounded-full" />,
                       action: (<EmployeeButtons _id={emp._id} />)
                    }));
                    setEmployees(data);
                    setFilterEmployees(data);
                }
            } catch(error) {
                if(error.response && !error.response.data.success) {
                    alert(error.response.data.error)
                }
            } finally {
                setEmpLoading(false);
            }
        };
        fetchEmployees();
    }, []);

     const filterProcess = (e) => {
        const records = employees.filter((emp) => 
            emp.name.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilterEmployees(records);
    }

    return (
        <div className="p-5">
            <div className="text-center">
                <h3 className="text-2xl font-bold">Manage Employees</h3>
            </div>
            <div className="flex justify-between items-center mt-6">
                <input 
                    type="text" 
                    placeholder="Search By Name" 
                    className="px-4 py-0.5 border"
                    onChange={filterProcess}
                 />
                <Link to="/admin-dashboard/add-employee" className="px-4 py-1 bg-teal-600 rounded text-white hover:bg-teal-700">Add New Employee</Link>
            </div>
             <div className='mt-5'>
                <DataTable columns={columns} data={filterEmployees} pagination />
            </div>
        </div>
    );
};

export default EmployeeList;
