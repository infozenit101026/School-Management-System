import mongoose from 'mongoose';

const classTeacherAssignmentSchema = new mongoose.Schema({
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
  assignedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, { timestamps: true });

// CRITICAL: Prevent assigning two Class Teachers to the same section for the same academic year
classTeacherAssignmentSchema.index({ academicYear: 1, sectionId: 1 }, { unique: true });

export default mongoose.model('ClassTeacherAssignment', classTeacherAssignmentSchema);