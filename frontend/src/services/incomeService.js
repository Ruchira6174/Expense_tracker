import api from './api';

const incomeService = {
  /**
   * Get all income records for the current user
   * @param {Object} params - Optional query parameters (source, month, limit, skip)
   * @returns {Promise} List of income records
   */
  getAll: async (params = {}) => {
    const response = await api.get('/income', { params });
    return response.data;
  },

  /**
   * Get a single income record by ID
   * @param {number|string} id - Income ID
   * @returns {Promise} Income object
   */
  getById: async (id) => {
    const response = await api.get(`/income/${id}`);
    return response.data;
  },

  /**
   * Create a new income record
   * @param {Object} incomeData - The income data payload
   * @returns {Promise} Created income object
   */
  create: async (incomeData) => {
    const response = await api.post('/income', incomeData);
    return response.data;
  },

  /**
   * Update an existing income record
   * @param {number|string} id - Income ID
   * @param {Object} updateData - Data to update
   * @returns {Promise} Updated income object
   */
  update: async (id, updateData) => {
    const response = await api.put(`/income/${id}`, updateData);
    return response.data;
  },

  /**
   * Delete an income record
   * @param {number|string} id - Income ID
   * @returns {Promise} Confirmation message
   */
  delete: async (id) => {
    const response = await api.delete(`/income/${id}`);
    return response.data;
  }
};

export default incomeService;
