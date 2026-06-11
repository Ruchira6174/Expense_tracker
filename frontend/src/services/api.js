import axios from 'axios';
import { getToken, removeToken } from '../utils/tokenStorage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const formatErrorMessage = (error) => {
  const detail = error.response?.data?.detail;

  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg || item).join(', ');
  }

  if (typeof detail === 'string') {
    return detail;
  }

  return error.message || 'An unexpected error occurred';
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();

      const isAuthPage = ['/login', '/register'].includes(window.location.pathname);
      if (!isAuthPage) {
        window.location.href = '/login';
      }
    }

    return Promise.reject({
      message: formatErrorMessage(error),
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default api;
