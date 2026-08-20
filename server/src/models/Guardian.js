import mongoose from 'mongoose';

const guardianSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true 
  },
  relationType: { 
    type: String, 
    enum: ['FATHER', 'MOTHER', 'GUARDIAN'], 
    required: true 
  },
  fullName: { type: String, required: true, trim: true },
  contactNumber: { type: String, required: true },
  email: { type: String, lowercase: true },
  occupation: { type: String },
  address: { type: String },
  isEmergencyContact: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Guardian', guardianSchema);