import api from './api';

export const staffAttendanceService = {
  // Get attendance for a specific date
  getAttendanceByDate: async (date) => {
    const response = await api.get('/staff-attendance', { params: { date } });
    return response.data;
  },

  // Bulk save attendance records (Used in our StaffAttendance.jsx)
  saveBulkAttendance: async (attendanceData) => {
    const response = await api.post('/staff-attendance/bulk', attendanceData);
    return response.data;
  },

  // Get attendance history for a specific staff member
  getStaffHistory: async (staffId, month, year) => {
    const response = await api.get(`/staff-attendance/${staffId}/history`, {
      params: { month, year }
    });
    return response.data;
  }
};
export const submitKioskPunch = async (credentials) => {
  // Assuming your backend route for this is /staff/attendance/kiosk
  // Adjust the URL if your route is slightly different!
  const response = await api.post('/staff/attendance/kiosk', credentials);
  return response.data;
};