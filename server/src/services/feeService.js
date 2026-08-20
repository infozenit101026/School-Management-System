// server/src/services/feeService.js
import mongoose from 'mongoose';
import FeeAssignment from '../models/FeeAssignment.js';
import FeeTransaction from '../models/FeeTransaction.js';
import AuditLog from '../models/AuditLog.js';

export const processFeePayment = async (assignmentId, paymentDetails, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const feeAssignment = await FeeAssignment.findById(assignmentId).session(session);
    if (!feeAssignment) throw new Error('FEE_ASSIGNMENT_NOT_FOUND');

    // 1. Validate Amount to prevent overpayment / negative balance
    if (paymentDetails.amount > feeAssignment.balance) {
      throw new Error('PAYMENT_EXCEEDS_BALANCE');
    }
    if (paymentDetails.amount <= 0) {
      throw new Error('INVALID_PAYMENT_AMOUNT');
    }

    // 2. Create Transaction Record
    const transaction = await FeeTransaction.create([{
      feeAssignment: assignmentId,
      paymentAmount: paymentDetails.amount,
      paymentMethod: paymentDetails.method,
      referenceNumber: paymentDetails.referenceNumber,
      collectedBy: userId
    }], { session });

    // 3. Update Assignment Totals[cite: 1]
    feeAssignment.amountPaid += paymentDetails.amount;
    feeAssignment.balance = feeAssignment.assignedAmount - feeAssignment.amountPaid;

    // 4. Determine New Status[cite: 1]
    if (feeAssignment.balance === 0) {
      feeAssignment.status = 'PAID';
    } else if (feeAssignment.amountPaid > 0) {
      feeAssignment.status = 'PARTIAL';
    }
    await feeAssignment.save({ session });

    // 5. Create Audit Log[cite: 1]
    await AuditLog.create([{
      user: userId,
      action: 'UPDATE',
      module: 'Student Fee',
      recordId: assignmentId,
      newValue: { paid: paymentDetails.amount, newBalance: feeAssignment.balance },
      timestamp: new Date()
    }], { session });

    await session.commitTransaction();
    session.endSession();

    return transaction[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(`Payment processing failed: ${error.message}`);
  }
};