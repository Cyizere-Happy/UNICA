import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://16.171.198.219:5034/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Clear all sessions
      localStorage.removeItem('token');
      localStorage.removeItem('unica-guest-session');

      // If we're in the management console, redirect to login
      // Otherwise (guest portal), redirect to home
      const isManagement = window.location.pathname.startsWith('/management');
      if (isManagement) {
        window.location.href = '/management/admin';
      } else {
        // Guest portal: Reload to force GuestAuthContext to reset state
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
