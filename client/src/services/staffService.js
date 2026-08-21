import api from './api';

export const staffService = {
  // Get all staff members
  getAllStaff: async (params = {}) => {
    const response = await api.get('/staff', { params });
    return response.data;
  },

  // Get a specific staff member by ID
  getStaffById: async (id) => {
    const response = await api.get(`/staff/${id}`);
    return response.data;
  },

  // Add a new staff member (Used in our AddStaff.jsx)
  createStaff: async (staffData) => {
    const response = await api.post('/staff', staffData);
    return response.data;
  },

  // Update a staff member
  updateStaff: async (id, staffData) => {
    const response = await api.put(`/staff/${id}`, staffData);
    return response.data;
  },

  // Delete/Deactivate staff
  deleteStaff: async (id) => {
    const response = await api.delete(`/staff/${id}`);
    return response.data;
  },

  assignTeacherToSubject: async (assignmentData) => {
    const response = await api.post('/staff/assign-subject', assignmentData);
    return response.data;
  },

  // Get subject assignments for a specific section
  getSectionAssignments: async (sectionId, academicYearId) => {
    const response = await api.get(`/staff/assignments/section/${sectionId}/${academicYearId}`);
    return response.data;
  }
};