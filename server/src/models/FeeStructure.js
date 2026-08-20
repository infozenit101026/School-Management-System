import mongoose from 'mongoose';

const feeStructureSchema = new mongoose.Schema({
  academicYear: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  feeType: {
    type: String,
    enum: ['SCHOOL_FEE', 'BUS_VAN_FEE', 'BOOK_FEE', 'UNIFORM_FEE', 'EVENT_FEE', 'TOUR_FEE', 'OTHER_FEE'],
    required: true
  },
  amount: { type: Number, required: true, min: [0, 'Fee amount cannot be negative'] },
  dueDate: { type: Date, required: true }
}, { timestamps: true });

// Prevent duplicate fee types for the same class in the same academic year
feeStructureSchema.index({ academicYear: 1, class: 1, feeType: 1 }, { unique: true });

export default mongoose.models.FeeStructure || mongoose.model('FeeStructure', feeStructureSchema);