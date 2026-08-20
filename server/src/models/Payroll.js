import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema({
  staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  month: { type: Number, required: true }, // 1-12
  year: { type: Number, required: true },
  
  basicSalary: { type: Number, required: true },
  allowances: { type: Number, default: 0 },
  bonus: { type: Number, default: 0 },
  overtime: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  advance: { type: Number, default: 0 },
  
  netSalary: { type: Number, required: true }, // Calculated field
  
  paymentStatus: { type: String, enum: ['PENDING', 'PAID'], default: 'PENDING' },
  paymentDate: { type: Date },
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Prevent duplicate payroll generation for the same staff member in the same month/year
payrollSchema.index({ staff: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model('Payroll', payrollSchema);