import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  admissionNumber: { type: String, required: true, unique: true },
  studentId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true, trim: true },
  photograph: { type: String }, // URL to uploaded file
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'], required: true },
  bloodGroup: { type: String },
  contactNumber: { type: String },
  address: { type: String, required: true },
  
  // Previous School Information
  previousSchool: { type: String },
  previousClass: { type: String },
  transferCertificateDetails: { type: String },
  
  admissionDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['ACTIVE', 'TRANSFERRED', 'DISCONTINUED', 'PASSED_OUT', 'SUSPENDED', 'ALUMNI'], 
    default: 'ACTIVE' 
  },
  statusChangeReason: { type: String },
  statusChangeDate: { type: Date },
  remarks: { type: String }
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);