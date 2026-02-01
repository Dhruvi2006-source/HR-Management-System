import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { columns, DepartmentButtons } from '../../utils/DepartmentHelper';
import axios from '../../utils/axios';

const DepartmentList = () => {
    const [departments, setDepartments] = useState([]);
    const [deptLoading, setDeptLoading] = useState(false);
    const [filterDepartments, setFilterDepartments] = useState([]);

    const onDepartmentDelete = async (id) => {
        const data = departments.filter(dept => dept._id !== id);
        setDepartments(data); // Optimistic update
    };

    useEffect(() => {
        const fetchDepartments = async () => {
            setDeptLoading(true);
            try {
                const response = await axios.get('/departments');
                if(response.data.success) {
                    let sno = 1;
                    const data = await response.data.departments.map(dept => ({
                       _id: dept._id,
                       sno: sno++,
                       deptName: dept.deptName,
                       action: (<DepartmentButtons _id={dept._id} onDepartmentDelete={onDepartmentDelete} />)
                    }));
                    setDepartments(data);
                    setFilterDepartments(data);
                }
            } catch(error) {
                if(error.response && !error.response.data.success) {
                    alert(error.response.data.error)
                }
            } finally {
                setDeptLoading(false);
            }
        };
        fetchDepartments();
    }, []);

    const filterProcess = (e) => {
        const records = departments.filter((dept) => 
            dept.deptName.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilterDepartments(records);
    }

    return (
        <div className="p-5">
            <div className="text-center">
                <h3 className="text-2xl font-bold">Manage Departments</h3>
            </div>
            <div className="flex justify-between items-center mt-6">
                <input 
                    type="text" 
                    placeholder="Search By Dep Name" 
                    className="px-4 py-0.5 border"
                    onChange={filterProcess}
                 />
                <Link to="/admin-dashboard/add-department" className="px-4 py-1 bg-teal-600 rounded text-white hover:bg-teal-700">Add New Department</Link>
            </div>
            <div className='mt-5'>
                <DataTable columns={columns} data={filterDepartments} pagination />
            </div>
        </div>
    );
};

export default DepartmentList;
