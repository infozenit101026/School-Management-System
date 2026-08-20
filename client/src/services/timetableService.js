import api from './api';

export const timetableService = {
  // Fetch timetable for a specific class and section
  getClassTimetable: async (classId, sectionId) => {
    const response = await api.get(`/timetable/class/${classId}/section/${sectionId}`);
    return response.data;
  },

  // Fetch timetable for a logged-in staff member
  getTeacherSchedule: async (staffId, academicYearId) => {
    const response = await api.get(`/timetable/teacher/${staffId}`, {
      params: { academicYearId }
    });
    return response.data;
  }
};