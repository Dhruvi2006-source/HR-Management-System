import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminLayout from './components/dashboard/AdminLayout';
import AdminSummary from './components/dashboard/AdminSummary';
import DepartmentList from './components/department/DepartmentList';
import AddDepartment from './components/department/AddDepartment';
import EditDepartment from './components/department/EditDepartment';
import EmployeeList from './components/employee/EmployeeList';
import AddEmployee from './components/employee/AddEmployee';
import EditEmployee from './components/employee/EditEmployee';
import EmployeeLayout from './components/dashboard/EmployeeLayout';
import EmployeeSummary from './components/dashboard/EmployeeSummary';
import Leaves from './components/leave/Leaves';
import Attendance from './components/attendance/Attendance';
import ViewProfile from './components/employee/ViewProfile';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import AdminLeaveList from './components/leave/AdminLeaveList';
import Salary from './components/salary/Salary';
import AddSalary from './components/salary/AddSalary';
import AdminAttendance from './components/attendance/AdminAttendance';

function App() {
  return (
    <BrowserRouter>
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin-dashboard" element={
                    <PrivateRoute requiredRole={['admin']}>
                        <AdminLayout />
                    </PrivateRoute>
                }>
                    <Route index element={<AdminSummary />} />
                    <Route path="/admin-dashboard/departments" element={<DepartmentList />} />
                    <Route path="/admin-dashboard/add-department" element={<AddDepartment />} />
                    <Route path="/admin-dashboard/department/:id" element={<EditDepartment />} />
                    <Route path="/admin-dashboard/employees" element={<EmployeeList />} />
                    <Route path="/admin-dashboard/add-employee" element={<AddEmployee />} />
                    <Route path="/admin-dashboard/employees/edit/:id" element={<EditEmployee />} />
                    <Route path="/admin-dashboard/leaves" element={<AdminLeaveList />} />
                    <Route path="/admin-dashboard/salary" element={<Salary />} />
                    <Route path="/admin-dashboard/salary/add" element={<AddSalary />} />
                    <Route path="/admin-dashboard/attendance" element={<AdminAttendance />} />
                    <Route path="/admin-dashboard/setting" element={<div>Settings</div>} />
                </Route>
                <Route path="/employee-dashboard" element={
                     <PrivateRoute requiredRole={['employee', 'admin']}>
                        <EmployeeLayout />
                    </PrivateRoute>
                }>
                    <Route index element={<EmployeeSummary />} />
                    <Route path="/employee-dashboard/profile" element={<ViewProfile />} />
                    <Route path="/employee-dashboard/leaves" element={<Leaves />} />
                    <Route path="/employee-dashboard/attendance" element={<Attendance />} />
                </Route>
                 {/* Fallback */}
                 <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
            </Routes>
        </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
