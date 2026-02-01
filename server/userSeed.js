import User from './models/User.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const userRegister = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const hashPassword = await bcrypt.hash('admin', 10);
        const newUser = new User({
            name: "Admin",
            email: "admin@gmail.com",
            password: hashPassword,
            role: "admin"
        });
        await newUser.save();
        console.log("Admin created successfully");
    } catch (error) {
        console.log("Error", error);
    } finally {
        mongoose.disconnect(); // Close connection
    }
};

userRegister();
