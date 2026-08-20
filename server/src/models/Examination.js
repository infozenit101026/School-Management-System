import mongoose from 'mongoose';

const examinationSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  }, // e.g., 'Quarterly Examination', 'Mid Term I'[cite: 1]
  academicYear: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'AcademicYear', 
    required: true 
  },
  startDate: { type: Date },
  endDate: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Examination', examinationSchema);