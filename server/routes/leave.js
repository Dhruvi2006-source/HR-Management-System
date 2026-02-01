import express from 'express';
import Leave from '../models/Leave.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

import { verifyRole } from '../middleware/authMiddleware.js';

// Get Leaves
router.get('/', verifyToken, async (req, res) => {
    try {
        let leaves;
        if (req.user.role === 'admin') {
            leaves = await Leave.find().populate({
                path: 'employeeId',
                populate: [
                    { path: 'department', select: 'deptName' }
                ]
            });
        } else {
            leaves = await Leave.find({ employeeId: req.user._id });
        }
        return res.status(200).json({ success: true, leaves });
    } catch(error) {
        console.log(error);
        return res.status(500).json({ success: false, error: "Get leaves server error" });
    }
});

// Admin Approve/Reject Leave
router.put('/:id', verifyToken, verifyRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const leave = await Leave.findByIdAndUpdate(id, { status }, { new: true });
        if (!leave) {
            return res.status(404).json({ success: false, error: "Leave not found" });
        }
        return res.status(200).json({ success: true, leave });
    } catch(error) {
        return res.status(500).json({ success: false, error: "Update leave server error" });
    }
});

// Apply for Leave
router.post('/add', verifyToken, async (req, res) => {
    try {
        const { leaveType, startDate, endDate, reason } = req.body;
        const newLeave = new Leave({
            employeeId: req.user._id,
            leaveType,
            startDate,
            endDate,
            reason
        });
        await newLeave.save();
        return res.status(200).json({ success: true, message: "Leave applied successfully" });
    } catch(error) {
        return res.status(500).json({ success: false, error: "Add leave server error" });
    }
});

export default router;
