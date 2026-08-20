import LeaveRequest from '../models/LeaveRequest.js';
import { validateLeaveRequest, validateLeaveApproval } from '../validators/staffValidator.js';

// Apply for leave
export const applyLeave = async (req, res, next) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    
    const { error } = validateLeaveRequest({
      staffId: req.user._id.toString(),
      leaveType,
      startDate,
      endDate,
      reason
    });
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const leave = await LeaveRequest.create({
      staffId: req.user._id,
      leaveType,
      startDate,
      endDate,
      reason
    });

    res.status(201).json({ success: true, data: leave });
  } catch (error) {
    next(error);
  }
};

// Get leave requests (Staff sees theirs; Admins/Staff Managers see all)
export const getLeaveRequests = async (req, res, next) => {
  try {
    const isManager = ['ADMIN', 'STAFF_MANAGER', 'SCHOOL_MANAGER'].includes(req.user.role);
    const query = isManager ? {} : { staffId: req.user._id };

    const leaves = await LeaveRequest.find(query)
      .populate('staffId', 'username email role')
      .populate('approvedBy', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: leaves.length, data: leaves });
  } catch (error) {
    next(error);
  }
};

// Approve or reject a leave request
export const updateLeaveStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminRemarks } = req.body;

    const { error } = validateLeaveApproval({ status, adminRemarks });
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const leave = await LeaveRequest.findById(id);
    if (!leave) return res.status(404).json({ success: false, message: 'Leave request not found' });

    leave.status = status;
    leave.approvedBy = req.user._id;
    if (adminRemarks) leave.adminRemarks = adminRemarks;

    await leave.save();

    res.status(200).json({ success: true, message: `Leave request ${status.toLowerCase()}`, data: leave });
  } catch (error) {
    next(error);
  }
};