import mongoose from 'mongoose';

const feeAssignmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  academicYear: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
  feeType: { 
    type: String, 
    enum: ['SCHOOL_FEE', 'BUS_VAN_FEE', 'BOOK_FEE', 'UNIFORM_FEE', 'EVENT_FEE', 'TOUR_FEE', 'OTHER_FEE'], 
    required: true 
  },
  assignedAmount: { type: Number, required: true },
  amountPaid: { type: Number, default: 0 },
  balance: { type: Number, required: true }, // Automatically calculated
  dueDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['PENDING', 'PARTIAL', 'PAID'], 
    default: 'PENDING' 
  },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('FeeAssignment', feeAssignmentSchema);