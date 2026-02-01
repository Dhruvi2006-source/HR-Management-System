import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, employeeId } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, error: "User already exists" });
    }
    
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        name, email, password: hashPassword, role, employeeId
    });
    
    await newUser.save();
    return res.status(201).json({ success: true, message: "User created successfully" });
    
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ success: false, error: "Wrong password" });
        }
        
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "10d" });
        
        return res.status(200).json({ 
            success: true, 
            token, 
            user: { _id: user._id, name: user.name, role: user.role } 
        });
    } catch(error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/verify', verifyToken, async (req, res) => {
    return res.status(200).json({ success: true, user: req.user });
});

export default router;
