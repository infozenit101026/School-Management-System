import Joi from 'joi';
import { ATTENDANCE_STATUS, LEAVE_TYPES, LEAVE_STATUS } from '../constants/staffConstants.js';

export const validateAttendance = (data) => {
  const schema = Joi.object({
    staffId: Joi.string().hex().length(24).required(),
    status: Joi.string().valid(...Object.values(ATTENDANCE_STATUS)).required(),
    checkInTime: Joi.date().iso().required(),
    checkOutTime: Joi.date().iso().min(Joi.ref('checkInTime')).optional(),
    remarks: Joi.string().max(200).optional().allow(''),
  });
  return schema.validate(data);
};

export const validateLeaveRequest = (data) => {
  const schema = Joi.object({
    staffId: Joi.string().hex().length(24).required(),
    leaveType: Joi.string().valid(...Object.values(LEAVE_TYPES)).required(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
    reason: Joi.string().max(500).required(),
  });
  return schema.validate(data);
};

export const validateLeaveApproval = (data) => {
  const schema = Joi.object({
    status: Joi.string().valid(LEAVE_STATUS.APPROVED, LEAVE_STATUS.REJECTED).required(),
    adminRemarks: Joi.string().max(200).optional().allow(''),
  });
  return schema.validate(data);
};