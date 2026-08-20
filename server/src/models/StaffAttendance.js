import mongoose from 'mongoose';
import { ATTENDANCE_STATUS } from '../constants/staffConstants.js';

const staffAttendanceSchema = new mongoose.Schema(
  {
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      enum: Object.values(ATTENDANCE_STATUS),
      required: true,
      default: ATTENDANCE_STATUS.PRESENT,
    },
    checkInTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    checkOutTime: {
      type: Date,
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: 200,
    },
  },
  { timestamps: true }
);

staffAttendanceSchema.index({ staffId: 1, date: 1 }, { unique: true });

export default mongoose.models.StaffAttendance || mongoose.model('StaffAttendance', staffAttendanceSchema);