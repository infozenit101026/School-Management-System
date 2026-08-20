import mongoose from 'mongoose';

const schoolSettingsSchema = new mongoose.Schema({
  schoolName: { type: String, required: true, default: 'My School' },
  attendanceClosingTime: { type: String, required: true, default: '12:00' }, // HH:MM (24-hour format)
  currentAcademicYear: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'AcademicYear' 
  }
}, { timestamps: true });

export default mongoose.models.SchoolSettings || mongoose.model('SchoolSettings', schoolSettingsSchema);