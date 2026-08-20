import ClassTeacherAssignment from '../models/ClassTeacherAssignment.js';
import Staff from '../models/Staff.js';
import { logAction } from '../services/auditService.js'; // <-- Using your existing service[cite: 27]

export const assignClassTeacher = async (req, res, next) => {
  try {
    const { academicYear, classId, sectionId, staff } = req.body;

    // 1. Check Staff Status
    const staffMember = await Staff.findById(staff).populate('user');
    if (!staffMember || !staffMember.user || staffMember.user.isActive === false) {
      return res.status(400).json({ success: false, message: 'Invalid or inactive staff member.' });
    }

    // 2. Check Existing Section Assignment Conflict
    const existingSectionAssignment = await ClassTeacherAssignment.findOne({ academicYear, sectionId });
    if (existingSectionAssignment) {
      return res.status(409).json({ success: false, message: 'Class Teacher already assigned for this section.' });
    }

    // 3. Check if Staff is already assigned elsewhere
    const existingTeacherRole = await ClassTeacherAssignment.findOne({ academicYear, staff });
    if (existingTeacherRole) {
      return res.status(409).json({ success: false, message: 'Staff already assigned to another section.' });
    }

    // 4. Create Assignment
    const assignment = await ClassTeacherAssignment.create({
      academicYear,
      classId,
      sectionId,
      staff,
      assignedBy: req.user._id
    });

    // 5. Trigger your Audit Service[cite: 27]
    await logAction({
      user: req.user._id,
      action: 'ASSIGNED',
      module: 'ACADEMICS',
      recordId: assignment._id,
      newValue: { academicYear, classId, sectionId, staff },
      ipAddress: req.ip
    });

    return res.status(201).json({ success: true, data: assignment });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Conflict: Assignment already exists.' });
    }
    next(error);
  }
};