import React, { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ChartCard from './ChartCard';
import ChartTooltip from './ChartTooltip';
import { DEFAULT_CHART_HEIGHT, EXPENSE_COLOR } from '../../constants/charts';
import { transformMonthlyExpenses } from '../../utils/chartData';
import { formatCurrency } from '../../utils/helpers';

const MonthlyExpenseBarChart = ({
  data,
  title = 'Monthly Expenses',
  description = 'Total expenses recorded each month.',
  loading = false,
  error = null,
  height = DEFAULT_CHART_HEIGHT,
  emptyMessage = 'No monthly expense data available.',
}) => {
  const chartData = useMemo(() => {
    if (Array.isArray(data) && data.every((item) => item.month && item.expenses !== undefined)) {
      return data;
    }
    return transformMonthlyExpenses(data);
  }, [data]);

  return (
    <ChartCard
      title={title}
      description={description}
      loading={loading}
      error={error}
      isEmpty={!chartData.length}
      emptyMessage={emptyMessage}
    >
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="month" tick={{ fill: 'var(--text)', fontSize: 12 }} />
          <YAxis
            tick={{ fill: 'var(--text)', fontSize: 12 }}
            tickFormatter={(value) => formatCurrency(value).replace(/\.\d{2}$/, '')}
          />
          <Tooltip content={<ChartTooltip />} />
          <Bar
            dataKey="expenses"
            name="Expenses"
            fill={EXPENSE_COLOR}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default MonthlyExpenseBarChart;
