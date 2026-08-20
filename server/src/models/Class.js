import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  }, // e.g., "Class 10"
  academicYear: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'AcademicYear', 
    required: true 
  }
}, { timestamps: true });

// Ensure class names are unique per academic year
classSchema.index({ name: 1, academicYear: 1 }, { unique: true });

export default mongoose.model('Class', classSchema);