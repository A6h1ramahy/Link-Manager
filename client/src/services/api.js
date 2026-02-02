import axios from 'axios';

// Use current origin if VITE_API_URL is not set (e.g., in production monolith)
const BASE_URL = import.meta.env.VITE_API_URL || '';
const API_URL = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and user cache
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if not already on auth pages
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Links API
export const linksAPI = {
  getAll: (params) => api.get('/links', { params }),
  search: (query) => api.get('/links/search', { params: { query } }),
  create: (data) => api.post('/links', data),
  update: (id, data) => api.put(`/links/${id}`, data),
  delete: (id) => api.delete(`/links/${id}`),
};

// Groups API
export const groupsAPI = {
  getAll: () => api.get('/groups'),
  create: (data) => api.post('/groups', data),
  update: (id, data) => api.put(`/groups/${id}`, data),
  delete: (id) => api.delete(`/groups/${id}`),
};

export default api;
