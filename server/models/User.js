import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['employee', 'admin'], default: 'employee' },
  profilePicture: { type: String },
  dob: { type: Date },
  gender: { type: String },
  maritalStatus: { type: String },
  designation: { type: String },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' }, // Fixed duplicate
  employeeId: { type: String },
  salary: { type: Number, default: 0 },
  address: { type: String }, // Details
  phone: { type: String },  // Details
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
