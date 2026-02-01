import express from 'express';
import Department from '../models/Department.js';
import { verifyToken, verifyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all departments
router.get('/', verifyToken, async (req, res) => {
    try {
        const departments = await Department.find();
        return res.status(200).json({ success: true, departments });
    } catch(error) {
        return res.status(500).json({ success: false, error: "Get departments server error" })
    }
});

// Add department
router.post('/add', verifyToken, verifyRole(['admin']), async (req, res) => {
    try {
        const { deptName, description } = req.body;
        const newDept = new Department({ deptName, description });
        await newDept.save();
        return res.status(200).json({ success: true, department: newDept });
    } catch(error) {
        return res.status(500).json({ success: false, error: "Add department server error" })
    }
});

// Edit department
router.put('/:id', verifyToken, verifyRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { deptName, description } = req.body;
        const updateDept = await Department.findByIdAndUpdate(id, { deptName, description }, { new: true });
        return res.status(200).json({ success: true, department: updateDept });
    } catch(error) {
        return res.status(500).json({ success: false, error: "Edit department server error" })
    }
})

// Delete department
router.delete('/:id', verifyToken, verifyRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        // Optionally check if employees are in this department
        await Department.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Department deleted" });
    } catch(error) {
        return res.status(500).json({ success: false, error: "Delete department server error" })
    }
})


export default router;
