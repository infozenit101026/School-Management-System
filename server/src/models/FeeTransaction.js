import mongoose from 'mongoose';

const feeTransactionSchema = new mongoose.Schema({
  feeAssignment: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeAssignment', required: true },
  paymentAmount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentMethod: { 
    type: String, 
    enum: ['CASH', 'BANK_TRANSFER', 'UPI', 'CHEQUE', 'CARD'], 
    required: true 
  },
  referenceNumber: { type: String }, // Cheque number or UPI transaction ID
  collectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('FeeTransaction', feeTransactionSchema);