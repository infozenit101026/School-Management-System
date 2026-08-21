import api from './api';

export const academicService = {
  getAcademicYears: async () => (await api.get('/academic/years')).data,
  createAcademicYear: async (data) => (await api.post('/academic/years', data)).data,
  
  getClassesByYear: async (yearId) => (await api.get(`/academic/classes/year/${yearId}`)).data,
  createClass: async (data) => (await api.post('/academic/classes', data)).data,

  getSectionsByClass: async (classId) => (await api.get(`/academic/sections/class/${classId}`)).data,
  createSection: async (data) => (await api.post('/academic/sections', data)).data,

  getSubjects: async () => (await api.get('/academic/subjects')).data,
  createSubject: async (data) => (await api.post('/academic/subjects', data)).data,

  assignClassTeacher: async (data) => (await api.post('/academic/class-teacher', data)).data,
};