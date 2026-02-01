import React from 'react';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <>
        <Navbar />
        <div className='text-center h-screen bg-gray-100 flex flex-col justify-center items-center'>
            <h1 className='text-4xl font-bold mb-4'>Welcome to Employee Management System</h1>
            <p className='text-xl text-gray-600 mb-8'>Efficiently manage your employees, attendance, leaves, and payroll.</p>
             <button className='px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition duration-300'>Get Started</button>
        </div>
    </>
  );
};

export default Home;
