import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
});

// Add interceptor to include JWT token in all requests
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

export const getDashboardStats = () => api.get('/dashboard/stats');
export const getProducts = () => api.get('/products');
export const getCategories = () => api.get('/categories');

export default api;
