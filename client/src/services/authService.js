import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    
    // Extract nested token from backend response structure: res.data.data.accessToken
    const token = response.data?.data?.accessToken;
    const user = response.data?.data?.user;

    if (token) {
      // Key must match 'accessToken' read by api.js
      localStorage.setItem('accessToken', token);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
    }
    
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};