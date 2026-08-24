import api from './api';

export const studentService = {
  // Fetch enrolled students list
  getEnrolledStudents: async (academicYearId, sectionId) => {
    const response = await api.get('/students/enrollments', {
      params: { academicYearId, sectionId }
    });
    return response.data;
  },

  getAllStudents: async (params = {}) => {
    const response = await api.get('/students/enrollments', { params });
    return response.data;
  },

  getStudentById: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  registerAdmission: async (admissionPayload) => {
    const response = await api.post('/students/admission', admissionPayload);
    return response.data;
  },

  updateStudent: async (id, payload) => {
  const response = await api.put(`/students/${id}`, payload);
  return response.data;
},

deleteStudent: async (id) => {
  const response = await api.delete(`/students/${id}`);
  return response.data;
}
};