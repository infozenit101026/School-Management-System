import mongoose from 'mongoose';

const vehicleAssignmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  academicYear: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  pickupStop: { type: String, required: true },
  dropStop: { type: String, required: true },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Prevent duplicate assignments for the same student in the same academic year
vehicleAssignmentSchema.index({ student: 1, academicYear: 1 }, { unique: true });

export default mongoose.models.VehicleAssignment || mongoose.model('VehicleAssignment', vehicleAssignmentSchema);