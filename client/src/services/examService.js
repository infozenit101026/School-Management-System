import api from '../../../server/src/services/api';

export const examService = {
  // Fetch examinations created for an academic year
  getExamsByYear: async (academicYearId) => {
    const response = await api.get(`/exam/year/${academicYearId}`);
    return response.data;
  },

  // Submit bulk student marks for a subject examination
  enterBatchMarks: async (payload) => {
    const response = await api.post('/exam/marks/batch', payload);
    return response.data;
  },

  // Create a new exam term
  createExam: async (payload) => {
    const response = await api.post('/exam', payload);
    return response.data;
  }
};