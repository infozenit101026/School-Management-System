import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  destination: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  
  eligibleClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
  
  tourFee: { type: Number, required: true, default: 0 }, // Integrates with FeeAssignment
  maxCapacity: { type: Number },
  
  registeredStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  
  status: { 
    type: String, 
    enum: ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'], 
    default: 'UPCOMING' 
  },
  organizedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.models.Tour || mongoose.model('Tour', tourSchema);