import api from './api'; // Assuming you have an Axios instance configured here

export const studentService = {
  // Fetch enrolled students based on academic year and section
  getEnrolledStudents: async (academicYearId, sectionId) => {
    const response = await api.get('/students', {
      params: { academicYearId, sectionId }
    });
    return response.data;
  }
};