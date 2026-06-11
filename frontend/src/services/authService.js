import api from './api';
import { AUTH_ROUTES } from '../constants/auth';
import { removeToken, setToken } from '../utils/tokenStorage';

const extractAccessToken = (data) => data?.access_token || data?.token || null;

const authService = {
  register: async (userData) => {
    const response = await api.post(AUTH_ROUTES.register, userData);
    const token = extractAccessToken(response.data);

    if (token) {
      setToken(token);
    }

    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post(AUTH_ROUTES.login, credentials);
    const token = extractAccessToken(response.data);

    if (token) {
      setToken(token);
    }

    return response.data;
  },

  logout: () => {
    removeToken();
  },

  getProfile: async () => {
    const response = await api.get(AUTH_ROUTES.me);
    return response.data;
  },
};

export default authService;
