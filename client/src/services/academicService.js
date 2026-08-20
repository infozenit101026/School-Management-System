import api from './api';

export const academicService = {
  getAcademicYears: async () => (await api.get('/academic/years')).data,
  getClassesByYear: async (yearId) => (await api.get(`/academic/classes/year/${yearId}`)).data,
  getSectionsByClass: async (classId) => (await api.get(`/academic/sections/class/${classId}`)).data,
};