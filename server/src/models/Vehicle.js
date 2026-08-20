import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true, unique: true, trim: true },
  capacity: { type: Number, required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  attendant: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  status: { 
    type: String, 
    enum: ['ACTIVE', 'MAINTENANCE', 'INACTIVE'], 
    default: 'ACTIVE' 
  }
}, { timestamps: true });

export default mongoose.model('Vehicle', vehicleSchema);