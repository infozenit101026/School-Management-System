import FeeAssignment from '../models/FeeAssignment.js';
import { processFeePayment } from '../services/feeService.js';

// Assign a new fee to a student
export const assignFee = async (req, res, next) => {
  try {
    const { student, academicYear, feeType, assignedAmount, dueDate } = req.body;
    
    // Create the assignment, initially setting the balance equal to the assignedAmount[cite: 12]
    const fee = await FeeAssignment.create({
      student,
      academicYear,
      feeType, // Must be 'SCHOOL_FEE', 'BUS_VAN_FEE', etc.[cite: 12]
      assignedAmount,
      balance: assignedAmount, 
      dueDate,
      assignedBy: req.user._id
    });

    res.status(201).json({ success: true, data: fee });
  } catch (error) {
    next(error);
  }
};

// Get all fees for a specific student
export const getStudentFees = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const fees = await FeeAssignment.find({ student: studentId })
      .populate('academicYear', 'year')
      .sort({ dueDate: 1 });
      
    res.status(200).json({ success: true, data: fees });
  } catch (error) {
    next(error);
  }
};

// Record a payment against a fee assignment using your feeService[cite: 14]
export const recordPayment = async (req, res, next) => {
  try {
    const { feeAssignmentId, amount, method, referenceNumber } = req.body;

    // Call your centralized service to handle transactions and audit logs[cite: 14]
    const transaction = await processFeePayment(
      feeAssignmentId,
      { amount, method, referenceNumber },
      req.user._id
    );

    res.status(201).json({
      success: true,
      message: 'Payment processed and logged successfully',
      data: transaction
    });
  } catch (error) {
    // Catch specific validation errors thrown by your service[cite: 14]
    if (
      error.message.includes('FEE_ASSIGNMENT_NOT_FOUND') || 
      error.message.includes('PAYMENT_EXCEEDS_BALANCE') || 
      error.message.includes('INVALID_PAYMENT_AMOUNT')
    ) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};