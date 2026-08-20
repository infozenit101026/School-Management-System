import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.js';

import authRoutes from './src/routes/authRoutes.js';
import academicRoutes from './src/routes/academicRoutes.js';
import studentRoutes from './src/routes/studentRoutes.js';
import staffRoutes from './src/routes/staffRoutes.js';
import attendanceRoutes from './src/routes/attendanceRoutes.js';
import feeRoutes from './src/routes/feeRoutes.js';
import eventRoutes from './src/routes/eventRoutes.js';
import transportRoutes from './src/routes/transportRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import notificationRoutes from './src/routes/notificationRoutes.js';
import timetableRoutes from './src/routes/timetableRoutes.js';
import auditRoutes from './src/routes/auditRoutes.js';
import staffAttendanceRoutes from './src/routes/staffAttendanceRoutes.js';
import leaveRoutes from './src/routes/leaveRoutes.js';
import payrollRoutes from './src/routes/payrollRoutes.js';
import markRoutes from './src/routes/markRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';
import settingsRoutes from './src/routes/settingsRoutes.js'; // Fixed path
import examRoutes from './src/routes/examRoutes.js'; // Fixed path

dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/academic', academicRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/marks', markRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/staff-attendance', staffAttendanceRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/exam', examRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/', (req, res) => {
  res.send('School Management System API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`Network access: http://192.168.1.37:${PORT}`);
});