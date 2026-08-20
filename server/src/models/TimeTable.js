import mongoose from 'mongoose';

const periodSchema = new mongoose.Schema({
  periodNumber: { type: Number, required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  startTime: { type: String, required: true }, // e.g., "09:00 AM"
  endTime: { type: String, required: true }    // e.g., "09:45 AM"
});

const timetableSchema = new mongoose.Schema({
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  academicYear: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
  day: { 
    type: String, 
    enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'], 
    required: true 
  },
  periods: [periodSchema]
}, { timestamps: true });

// Prevent duplicate timetables for the same class section on the same day
timetableSchema.index({ class: 1, section: 1, day: 1, academicYear: 1 }, { unique: true });

export default mongoose.models.Timetable || mongoose.model('Timetable', timetableSchema);