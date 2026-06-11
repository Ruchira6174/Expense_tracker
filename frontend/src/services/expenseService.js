import api from './api';

const expenseService = {
  /**
   * Get all expenses for the current user
   * @param {Object} params - Optional query parameters (title, category, date, limit, skip)
   * @returns {Promise} List of expenses
   */
  getAll: async (params = {}) => {
    const response = await api.get('/expenses', { params });
    return response.data;
  },

  /**
   * Get a single expense by ID
   * @param {number|string} id - Expense ID
   * @returns {Promise} Expense object
   */
  getById: async (id) => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  /**
   * Create a new expense
   * @param {Object} expenseData - The expense data payload
   * @returns {Promise} Created expense object
   */
  create: async (expenseData) => {
    const response = await api.post('/expenses', expenseData);
    return response.data;
  },

  /**
   * Update an existing expense
   * @param {number|string} id - Expense ID
   * @param {Object} updateData - Data to update
   * @returns {Promise} Updated expense object
   */
  update: async (id, updateData) => {
    const response = await api.put(`/expenses/${id}`, updateData);
    return response.data;
  },

  /**
   * Delete an expense
   * @param {number|string} id - Expense ID
   * @returns {Promise} Confirmation message
   */
  delete: async (id) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  }
};

export default expenseService;
