import express from 'express';
import Salary from '../models/Salary.js';
import User from '../models/User.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get Salary Info for specific employee or all employees
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        // If 'all', return list (For Admin view)
        // Actually, let's make a separate route for list or handle id params carefully. I'll just use query param logic or separate route.
        // Let's stick to RESTful: GET / (list), GET /:id (detail)
        let salaries;
        if (req.user.role === 'admin') {
             salaries = await Salary.find({ employeeId: id }).populate('employeeId', 'name email department');
        } else {
             // Employee can only see their own
             if (req.user._id !== id) return res.status(403).json({success: false, error: "Access Denied"});
             salaries = await Salary.find({ employeeId: id }).populate('employeeId', 'name email');
        }
        return res.status(200).json({ success: true, salaries });
        
    } catch(error) {
        return res.status(500).json({ success: false, error: "Salary get error" });
    }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        // Admin gets all latest salary structures or payroll history?
        // Question asked: "View payroll of all employees".
        // This likely means a list of employees with their CURRENT salary structure.
        // So I need to fetch Users and their associated latest Salary record.
        const users = await User.find({ role: 'employee' }).select('name department salary');
        // If I use the separate Salary model for history, I might only query User salary for "structure".
        // Let's assume "Salary Structure" updates the User model's `salary`, OR creates a new `Salary` record.
        // The user prompt: "Update salary structure".
        // Let's interpret: Admin sees list of employees, clicks "Pay" or "Edit", edits allowances/deductions, saves -> Creates a Salary record (or updates structure).
        
        // Let's return Users list joined with their latest Salary info if available.
        return res.status(200).json({ success: true, employees: users });
    } catch(error) {
        return res.status(500).json({ success: false, error: "Salary list error" });
    }
})

// Add/Update Salary (Generate Payroll)
router.post('/add', verifyToken, async (req, res) => {
    try {
        const { employeeId, basicSalary, allowances, deductions, payDate } = req.body;
        const netSalary = parseInt(basicSalary) + parseInt(allowances) - parseInt(deductions);
        
        const newSalary = new Salary({
            employeeId,
            basicSalary,
            allowances,
            deductions,
            netSalary,
            payDate
        });
        
        await newSalary.save();
        
        return res.status(200).json({ success: true, message: "Salary added successfully" });
    } catch(error) {
         return res.status(500).json({ success: false, error: "Salary add error" });
    }
});

export default router;
