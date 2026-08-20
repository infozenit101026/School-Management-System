import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true, trim: true },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  fullName: { type: String, required: true, trim: true },
  designation: { type: String, required: true, trim: true }, // e.g., "Senior Teacher", "Lab Assistant"
  department: { type: String, required: true, trim: true }, // e.g., "Science", "Mathematics", "Administration"
  qualification: { type: String, trim: true },
  contactNumber: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  joiningDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['ACTIVE', 'ON_LEAVE', 'RESIGNED', 'TERMINATED'], 
    default: 'ACTIVE' 
  }
}, { timestamps: true });

export default mongoose.model('Staff', staffSchema);