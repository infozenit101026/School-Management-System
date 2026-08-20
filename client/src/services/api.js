import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' || 'http://192.168.1.37:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Token dynamically
api.interceptors.request.use(
  (config) => {
    // 🚨 Corrected to match the exact key from your screenshot
    const token = localStorage.getItem('accessToken'); 
    
    if (token) {
      if (typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the error is exactly a 401 Unauthorized
    if (error.response && error.response.status === 401) {
      console.warn('Token expired or unauthorized. Redirecting to login...');
      
      // Clear the dead credentials matching your authService[cite: 14]
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      
      // Force redirect to the login page defined in your App.jsx[cite: 17]
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;