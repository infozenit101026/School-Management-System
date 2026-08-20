import { 
  getAdminDashboardStats,
  getSchoolManagerStats,
  getStaffManagerStats,
  getStudentManagerStats,
  getStaffDashboardStats
} from '../services/dashboardService.js';

export const getDashboardData = async (req, res, next) => {
  try {
    const { role } = req.user;
    let data = {};

    switch (role) {
      case 'ADMIN':
        data = await getAdminDashboardStats(); // Full analytics
        break;
      case 'SCHOOL_MANAGER':
        data = await getSchoolManagerStats(); // Classes, sections, academic stats[cite: 16]
        break;
      case 'STAFF_MANAGER':
        data = await getStaffManagerStats(); // Total staff, workload[cite: 16]
        break;
      case 'STUDENT_MANAGER':
        data = await getStudentManagerStats(); // Admissions, active students[cite: 16]
        break;
      case 'STAFF':
        data = await getStaffDashboardStats(req.user._id); // Staff specific data[cite: 16]
        break;
      default:
        return res.status(403).json({ success: false, message: 'Invalid role dashboard request' });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};