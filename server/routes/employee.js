import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import { verifyToken, verifyRole } from '../middleware/authMiddleware.js';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

// Get All Employees
router.get('/', verifyToken, async (req, res) => {
    try {
        const employees = await User.find({ role: 'employee' }).populate('department');
        return res.status(200).json({ success: true, employees });
    } catch(error) {
        return res.status(500).json({ success: false, error: "Get employees server error" });
    }
});

// Add Employee
router.post('/add', verifyToken, verifyRole(['admin']), upload.single('image'), async (req, res) => {
    try {
        const {
            name,
            email,
            employeeId,
            dob,
            gender,
            maritalStatus,
            designation,
            department,
            salary,
            password,
            role
        } = req.body;

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, error: "User already registered" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashPassword,
            employeeId,
            dob,
            gender,
            maritalStatus,
            designation,
            department,
            salary,
            role,
            profilePicture: req.file ? req.file.filename : ""
        });

        await newUser.save();
        return res.status(200).json({ success: true, message: "Employee created successfully" });

    } catch(error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: "Add employee server error" });
    }
});

// Get Single Employee
router.get('/:id', verifyToken, async (req, res) => {
    try {
         const { id } = req.params;
         let employee;
         // Allow fetching pretty much any user by ID for profile view
         employee = await User.findById(id).populate('department').select('-password');
         if(!employee) {
             return res.status(404).json({ success: false, error: "Employee not found" });
         }
         return res.status(200).json({ success: true, employee });
    } catch(error) {
        return res.status(500).json({ success: false, error: "Get employee server error" });
    }
});


// Update Employee Profile (Self)
router.put('/:id/profile', verifyToken, upload.single('profilePicture'), async (req, res) => {
    try {
        const { id } = req.params;
        const { address, phone } = req.body;
        
        // Ensure user is updating their own profile or is admin
        if(req.user._id.toString() !== id && req.user.role !== 'admin') {
             return res.status(403).json({ success: false, error: "Unauthorized" });
        }

        const updates = { address, phone };
        if(req.file) {
            updates.profilePicture = req.file.filename;
        }

        const employee = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
        
        if(!employee) {
             return res.status(404).json({ success: false, error: "Employee not found" });
        }

        return res.status(200).json({ success: true, employee, message: "Profile updated successfully" });
    } catch(error) {
        console.error("Profile update error", error);
        return res.status(500).json({ success: false, error: "Profile update server error" });
    }
});

// Update Employee
router.put('/:id', verifyToken, verifyRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            maritalStatus,
            designation,
            department,
            salary,
            employeeId,
            dob,
            gender,
            address,
            phone
        } = req.body;

        const employee = await User.findById(id);
        if(!employee) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }

        const user = await User.findByIdAndUpdate(id, {
            name,
            maritalStatus,
            designation,
            department,
            salary,
            employeeId,
            dob,
            gender,
            address,
            phone
        }, { new: true });

        return res.status(200).json({ success: true, message: "Employee updated" });
    } catch(error) {
        return res.status(500).json({ success: false, error: "Update employee server error" });
    }
});

export default router;
