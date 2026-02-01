import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';

const AddSalary = () => {
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    
    // Form Data
    const [salary, setSalary] = useState({
        employeeId: '',
        basicSalary: '',
        allowances: '',
        deductions: '',
        payDate: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('/departments');
                if (response.data.success) {
                    setDepartments(response.data.departments);
                }
            } catch (error) {
                console.error("Error fetching departments", error);
            }
        };
        fetchDepartments();
    }, []);
    
    // Fetch employees when department is selected (simplified: fetching all employees for now or search logic needed?)
    // User requested "Update salary structure". It's usually per employee.
    // I will fetch all employees first.
     useEffect(() => {
        const fetchEmployees = async () => {
             try {
                const response = await axios.get('/employees');
                if (response.data.success) {
                     setEmployees(response.data.employees);
                }
             } catch(error) {
                 console.log(error);
             }
        }
        fetchEmployees();
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setSalary(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/salary/add', salary);
            if(response.data.success) {
                alert("Salary Added Successfully");
                navigate('/admin-dashboard/salary');
            }
        } catch(error) {
             alert(error.response?.data?.error || "Server Error");
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md font-roboto">
             <h2 className="text-2xl font-bold mb-6">Add Salary</h2>
             <form onSubmit={handleSubmit}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Employee Selection */}
                     <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Select Employee</label>
                        <select 
                            name="employeeId"
                            className="mt-1 w-full p-2 border rounded-md"
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Employee</option>
                            {employees.map(emp => (
                                <option key={emp._id} value={emp._id}>{emp.employeeId} - {emp.name}</option>
                            ))}
                        </select>
                     </div>
                     
                     <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Basic Salary</label>
                        <input type="number" name="basicSalary" className="mt-1 w-full p-2 border rounded-md" placeholder="Basic Salary" onChange={handleChange} required />
                     </div>
                     <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Allowances</label>
                        <input type="number" name="allowances" className="mt-1 w-full p-2 border rounded-md" placeholder="Allowances" onChange={handleChange} required />
                     </div>
                     <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Deductions</label>
                        <input type="number" name="deductions" className="mt-1 w-full p-2 border rounded-md" placeholder="Deductions" onChange={handleChange} required />
                     </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Pay Date</label>
                        <input type="date" name="payDate" className="mt-1 w-full p-2 border rounded-md" onChange={handleChange} required />
                     </div>
                 </div>
                 <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700">Add Salary</button>
             </form>
        </div>
    );
};

export default AddSalary;
