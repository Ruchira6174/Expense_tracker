import api from './api';

const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration details (e.g. email, password, name)
   * @returns {Promise} Response data
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Login an existing user
   * @param {Object} credentials - User credentials (email, password)
   * @returns {Promise} Response data (usually includes token and user info)
   */
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    // Usually backend returns access_token. Save it to localStorage if so.
    if (response.data && response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem('token');
  },

  /**
   * Get current authenticated user's profile
   * @returns {Promise} User profile data
   */
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export default authService;
