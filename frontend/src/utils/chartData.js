import { formatMonthLabel } from './helpers';

export const transformCategoryExpenses = (categoryData) => {
  if (!categoryData || typeof categoryData !== 'object' || Array.isArray(categoryData)) {
    return [];
  }

  return Object.entries(categoryData)
    .map(([name, value]) => ({
      name,
      value: Number(value) || 0,
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);
};

export const transformMonthlySummary = (monthlyData) => {
  if (!monthlyData) {
    return [];
  }

  if (Array.isArray(monthlyData)) {
    return monthlyData
      .map((item) => ({
        month: item.label || formatMonthLabel(item.month || item.month_key || item.period),
        monthKey: item.month || item.month_key || item.period,
        income: Number(item.income) || 0,
        expenses: Number(item.expenses) || 0,
        balance: Number(item.balance) || 0,
      }))
      .sort((a, b) => String(a.monthKey).localeCompare(String(b.monthKey)));
  }

  if (typeof monthlyData === 'object') {
    return Object.entries(monthlyData)
      .map(([monthKey, values]) => {
        const income = Number(values?.income) || 0;
        const expenses = Number(values?.expenses) || 0;

        return {
          month: formatMonthLabel(monthKey),
          monthKey,
          income,
          expenses,
          balance: Number(values?.balance) || income - expenses,
        };
      })
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey));
  }

  return [];
};

export const transformMonthlyExpenses = (monthlyData) => {
  return transformMonthlySummary(monthlyData).map(({ month, monthKey, expenses }) => ({
    month,
    monthKey,
    expenses,
  }));
};
