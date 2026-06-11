export const formatCurrency = (amount, currency = 'USD') => {
  const value = Number(amount) || 0;

  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatMonthLabel = (monthKey) => {
  if (!monthKey || typeof monthKey !== 'string') {
    return monthKey || '';
  }

  const [year, month] = monthKey.split('-');
  if (!year || !month) {
    return monthKey;
  }

  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
};
