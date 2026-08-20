import mongoose from 'mongoose';

const markSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  academicYear: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  examination: { type: mongoose.Schema.Types.ObjectId, ref: 'Examination', required: true },
  
  maximumMarks: { type: Number, required: true },
  obtainedMarks: { type: Number, required: true },
  grade: { type: String },
  remarks: { type: String },
  
  enteredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Prevent entering multiple mark sheets for the same student, subject, and exam
markSchema.index({ student: 1, subject: 1, examination: 1 }, { unique: true });

export default mongoose.model('Mark', markSchema);