import mongoose from 'mongoose';

const studentEnrollmentSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true 
  },
  academicYear: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'AcademicYear', 
    required: true 
  },
  class: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Class', 
    required: true 
  },
  section: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Section', 
    required: true 
  },
  rollNumber: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['ENROLLED', 'PROMOTED', 'RETAINED', 'WITHDRAWN'], 
    default: 'ENROLLED' 
  }
}, { timestamps: true });

// Ensure a student can only have ONE active enrollment record per academic year
studentEnrollmentSchema.index({ student: 1, academicYear: 1 }, { unique: true });

// Ensure roll numbers are unique within a section for a given academic year
studentEnrollmentSchema.index({ academicYear: 1, section: 1, rollNumber: 1 }, { unique: true });

export default mongoose.models.StudentEnrollment || mongoose.model('StudentEnrollment', studentEnrollmentSchema);