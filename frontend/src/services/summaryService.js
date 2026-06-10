import api from './api';

const summaryService = {
  /**
   * Get the dashboard summary (Total Income, Total Expenses, Balance, Savings)
   * @param {Object} params - Optional query params like month, year
   * @returns {Promise} Summary data object
   */
  getDashboardSummary: async (params = {}) => {
    const response = await api.get('/summary', { params });
    return response.data;
  },

  /**
   * Get expenses broken down by category for charts
   * @param {Object} params - Optional query params like start_date, end_date
   * @returns {Promise} Category breakdown data
   */
  getExpensesByCategory: async (params = {}) => {
    const response = await api.get('/summary/category-expenses', { params });
    return response.data;
  },

  /**
   * Get monthly trends for income vs expenses
   * @param {Object} params - Optional query params like month, year
   * @returns {Promise} Monthly trend data
   */
  getMonthlyTrends: async (params = {}) => {
    const response = await api.get('/summary/monthly', { params });
    return response.data;
  }
};

export default summaryService;
