import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public/uploads'))

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
};

import authRouter from './routes/auth.js';
import departmentRouter from './routes/department.js';
import employeeRouter from './routes/employee.js';

import leaveRouter from './routes/leave.js';
import attendanceRouter from './routes/attendance.js';
import salaryRouter from './routes/salary.js';
import dashboardRouter from './routes/dashboard.js';

app.use('/api/auth', authRouter);
app.use('/api/departments', departmentRouter);
app.use('/api/employees', employeeRouter);
app.use('/api/leaves', leaveRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/salary', salaryRouter);


// Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
