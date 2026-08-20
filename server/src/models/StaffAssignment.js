import mongoose from 'mongoose';

const staffAssignmentSchema = new mongoose.Schema({
  staff: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Staff', 
    required: true 
  },
  academicYear: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'AcademicYear', 
    required: true 
  },
  classId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Class', 
    required: true 
  },
  sectionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Section', 
    required: true 
  },
  subject: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subject', 
    required: true 
  }
}, { timestamps: true });

// Prevent assigning the exact same subject in the same section twice to the same or different teacher
staffAssignmentSchema.index({ academicYear: 1, sectionId: 1, subject: 1 }, { unique: true });

export default mongoose.model('StaffAssignment', staffAssignmentSchema);