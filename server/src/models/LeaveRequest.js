import mongoose from 'mongoose';
import { LEAVE_TYPES, LEAVE_STATUS } from '../constants/staffConstants.js';

const leaveRequestSchema = new mongoose.Schema(
  {
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    leaveType: {
      type: String,
      enum: Object.values(LEAVE_TYPES),
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: Object.values(LEAVE_STATUS),
      default: LEAVE_STATUS.PENDING,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // The admin who approved/rejected the leave
    },
    adminRemarks: {
      type: String,
      trim: true,
      maxlength: 200,
    },
  },
  { timestamps: true }
);

export default mongoose.models.LeaveRequest || mongoose.model('LeaveRequest', leaveRequestSchema);