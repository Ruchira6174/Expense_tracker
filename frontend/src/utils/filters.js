export const normalizeDateValue = (dateValue) => {
  if (!dateValue) {
    return '';
  }

  return String(dateValue).slice(0, 10);
};

export const normalizeListResponse = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  return [];
};

export const buildExpenseQueryParams = ({ title = '', category = '', date = '' } = {}) => {
  const params = {};

  if (title.trim()) {
    params.title = title.trim();
  }

  if (category) {
    params.category = category;
  }

  if (date) {
    params.date = date;
  }

  return params;
};

export const buildIncomeQueryParams = ({ source = '', month = '' } = {}) => {
  const params = {};

  if (source.trim()) {
    params.source = source.trim();
  }

  if (month) {
    params.month = month;
  }

  return params;
};

export const filterExpenses = (expenses, { title = '', category = '', date = '' } = {}) => {
  const searchTerm = title.trim().toLowerCase();

  return expenses.filter((expense) => {
    if (searchTerm && !expense.title?.toLowerCase().includes(searchTerm)) {
      return false;
    }

    if (category && expense.category !== category) {
      return false;
    }

    if (date && normalizeDateValue(expense.date) !== date) {
      return false;
    }

    return true;
  });
};

export const filterIncome = (incomes, { source = '', month = '' } = {}) => {
  const searchTerm = source.trim().toLowerCase();

  return incomes.filter((income) => {
    if (searchTerm && !income.source?.toLowerCase().includes(searchTerm)) {
      return false;
    }

    if (month && !normalizeDateValue(income.date).startsWith(month)) {
      return false;
    }

    return true;
  });
};

export const hasActiveExpenseFilters = (filters) =>
  Boolean(filters.title?.trim() || filters.category || filters.date);

export const hasActiveIncomeFilters = (filters) =>
  Boolean(filters.source?.trim() || filters.month);
