import api from './api';

export const attendanceService = {
  // Clock in for the day
  clockIn: async (data = {}) => {
    const response = await api.post('/staff/attendance/clock-in', data);
    return response.data;
  },

  // Clock out for the day
  clockOut: async () => {
    const response = await api.post('/staff/attendance/clock-out');
    return response.data;
  },

  // Get attendance logs (supports staffId, startDate, endDate query params)
  getAttendanceLogs: async (params = {}) => {
    const response = await api.get('/staff/attendance', { params });
    return response.data;
  },

    saveBatchAttendance: async (attendanceDataPayload) => {
    // attendanceDataPayload should include: academicYear, classId, sectionId, date, and attendanceData array
    const response = await api.post('/attendance/batch', attendanceDataPayload);
    return response.data;
  },

  // Retrieve existing attendance for a specific section and date
  getSectionAttendance: async (sectionId, date) => {
    const response = await api.get('/attendance/section', {
      params: { sectionId, date }
    });
    return response.data;
  }
};