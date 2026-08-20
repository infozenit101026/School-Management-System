import Student from '../models/Student.js';
import User from '../models/User.js';
import Class from '../models/Class.js';
import FeeAssignment from '../models/FeeAssignment.js';
import Timetable from '../models/Timetable.js';

// ==========================================
// ADMIN: Sees Everything
// ==========================================
export const getAdminDashboardStats = async () => {
  const [totalStudents, totalStaff, totalClasses] = await Promise.all([
    Student.countDocuments({ status: true }),
    User.countDocuments({ role: { $in: ['STAFF', 'STAFF_MANAGER', 'SCHOOL_MANAGER'] }, isActive: true }),
    Class.countDocuments()
  ]);

  const feeMetrics = await FeeAssignment.aggregate([
    {
      $group: {
        _id: null,
        totalAssigned: { $sum: '$assignedAmount' },
        totalCollected: { $sum: '$amountPaid' },
        totalPending: { $sum: '$balance' }
      }
    }
  ]);

  const fees = feeMetrics.length > 0 
    ? { 
        totalAssigned: feeMetrics[0].totalAssigned, 
        totalCollected: feeMetrics[0].totalCollected, 
        totalPending: feeMetrics[0].totalPending 
      } 
    : { totalAssigned: 0, totalCollected: 0, totalPending: 0 };

  return { counts: { students: totalStudents, staff: totalStaff, classes: totalClasses }, fees };
};

// ==========================================
// SCHOOL MANAGER: Focuses on Academics
// ==========================================
export const getSchoolManagerStats = async () => {
  const [totalClasses, totalStudents] = await Promise.all([
    Class.countDocuments(),
    Student.countDocuments({ isActive: true })
  ]);
  
  return { counts: { classes: totalClasses, students: totalStudents } };
};

// ==========================================
// STAFF MANAGER: Focuses on Employees
// ==========================================
export const getStaffManagerStats = async () => {
  const totalStaff = await User.countDocuments({ role: 'STAFF', isActive: true });
  return { counts: { activeStaff: totalStaff } };
};

// ==========================================
// STUDENT MANAGER: Focuses on Enrollment
// ==========================================
export const getStudentManagerStats = async () => {
  const [activeStudents, pendingFeesCount] = await Promise.all([
    Student.countDocuments({ isActive: true }),
    FeeAssignment.countDocuments({ status: { $in: ['PENDING', 'PARTIAL'] } })
  ]);
  
  return { 
    counts: { activeStudents, studentsWithPendingFees: pendingFeesCount } 
  };
};

// ==========================================
// STAFF: Focuses on their own Schedule/Classes
// ==========================================
export const getStaffDashboardStats = async (userId) => {
  // Fetch the teacher's schedule for the current week
  const mySchedule = await Timetable.find({ 'periods.teacher': userId })
    .populate('class', 'name')
    .populate('section', 'name')
    .populate('periods.subject', 'name code')
    .sort({ day: 1 });

  return { schedule: mySchedule };
};