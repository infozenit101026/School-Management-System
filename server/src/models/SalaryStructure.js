import mongoose from 'mongoose';

const salaryStructureSchema = new mongoose.Schema({
  staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true, unique: true },
  basicSalary: { type: Number, required: true, min: [0, 'Basic salary cannot be negative'] },
  allowances: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  salaryType: { type: String, enum: ['MONTHLY', 'HOURLY'], default: 'MONTHLY' },
  hourlyWage: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.models.SalaryStructure || mongoose.model('SalaryStructure', salaryStructureSchema);