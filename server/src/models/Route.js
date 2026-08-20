import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, // e.g., "North City Route"
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  stops: [{
    stopName: { type: String, required: true },
    arrivalTime: { type: String, required: true } // e.g., "07:30 AM"
  }],
  assignedStudents: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    stopId: { type: mongoose.Schema.Types.ObjectId }
  }],
  busFee: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Route', routeSchema);