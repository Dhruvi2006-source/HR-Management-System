import express from 'express';
import Attendance from '../models/Attendance.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();


import Leave from '../models/Leave.js';

// Get Attendance
router.get('/', verifyToken, async (req, res) => {
    try {
        let attendance;
        let leaves;
        let query = {};
        
        if (req.user.role !== 'admin') {
            query.employeeId = req.user._id;
        }

        attendance = await Attendance.find(query).populate('employeeId').sort({ date: -1 });
        leaves = await Leave.find({ ...query, status: 'approved' }).populate('employeeId');

        let result = [...attendance];

        leaves.forEach(leave => {
            const start = new Date(leave.startDate);
            const end = new Date(leave.endDate);
            
            const current = new Date(start);
            while (current <= end) {
                // For admin view, we need to match both date AND employeeId
                const exists = attendance.find(att => 
                    new Date(att.date).toDateString() === current.toDateString() &&
                    att.employeeId._id.toString() === leave.employeeId._id.toString()
                );

                if (!exists) {
                     result.push({
                        _id: leave._id + '-' + current.getTime() + '-' + leave.employeeId._id, 
                        employeeId: leave.employeeId, // Populated user object
                        date: new Date(current),
                        status: 'leave',
                        checkInTime: null,
                        checkOutTime: null
                    });
                }
                current.setDate(current.getDate() + 1);
            }
        });

        result.sort((a, b) => new Date(b.date) - new Date(a.date));

        return res.status(200).json({ success: true, attendance: result });
    } catch(error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Get attendance server error" });
    }
});

// Check In / Check Out (Simplified logic)
router.post('/mark', verifyToken, async (req, res) => {
    try {
        // Find if there's an attendance record for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const existingAttachment = await Attendance.findOne({ 
            employeeId: req.user._id, 
            date: { $gte: today } 
        });

        if (existingAttachment) {
             if (existingAttachment.checkOutTime) {
                 return res.status(400).json({ success: false, error: "Already checked out for today" });
             }
             // Mark Check Out
             existingAttachment.checkOutTime = new Date();
             
             // Calculate duration in hours
             const checkIn = new Date(existingAttachment.checkInTime);
             const checkOut = new Date(existingAttachment.checkOutTime);
             const duration = (checkOut - checkIn) / (1000 * 60 * 60); // hours

             if (duration < 4) {
                 existingAttachment.status = 'half-day';
             } else {
                 existingAttachment.status = 'present';
             }

             await existingAttachment.save();
             return res.status(200).json({ success: true, message: "Checked Out successfully" });
        } else {
             // Mark Check In
             const newAttendance = new Attendance({
                 employeeId: req.user._id,
                 checkInTime: new Date(),
                 status: 'present', // Default to present, will update on checkout if needed
                 date: today
             });
             await newAttendance.save();
             return res.status(200).json({ success: true, message: "Checked In successfully" });
        }
    } catch(error) {
        return res.status(500).json({ success: false, error: "Attendance mark server error" });
    }
});

export default router;
