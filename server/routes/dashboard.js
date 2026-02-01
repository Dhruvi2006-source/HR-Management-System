import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import Department from '../models/Department.js';
import User from '../models/User.js';
import Leave from '../models/Leave.js';

const router = express.Router();

router.get('/summary', verifyToken, async (req, res) => {
    try {
        const totalEmployees = await User.countDocuments({ role: { $ne: 'admin' } });
        const totalDepartments = await Department.countDocuments();
        
        const employeeSalaries = await User.aggregate([
          { $match: { role: { $ne: 'admin' } } },
          {
            $group: {
              _id: null,
              totalSalary: { $sum: "$salary" }
            }
          }
        ]);
        
        const totalSalary = employeeSalaries.length > 0 ? employeeSalaries[0].totalSalary : 0;

        const leaveSummary = {
             appliedFor: await Leave.countDocuments(),
             approved: await Leave.countDocuments({status: "approved"}),
             rejected: await Leave.countDocuments({status: "rejected"}),
             pending: await Leave.countDocuments({status: "pending"}),
        }

        return res.status(200).json({ 
            success: true, 
            summary: {
                totalEmployees,
                totalDepartments,
                totalSalary,
                leaveSummary
            } 
        });

    } catch(error) {
        console.log(error);
        return res.status(500).json({ success: false, error: "Dashboard summary error" });
    }
});

export default router;
