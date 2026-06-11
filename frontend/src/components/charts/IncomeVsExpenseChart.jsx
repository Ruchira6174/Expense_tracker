import React, { useMemo } from 'react';
import {
  Bar,
  CartesianGrid,
  Legend,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ChartCard from './ChartCard';
import ChartTooltip from './ChartTooltip';
import { DEFAULT_CHART_HEIGHT, EXPENSE_COLOR, INCOME_COLOR } from '../../constants/charts';
import { transformMonthlySummary } from '../../utils/chartData';
import { formatCurrency } from '../../utils/helpers';

const IncomeVsExpenseChart = ({
  data,
  title = 'Income vs Expenses',
  description = 'Monthly comparison of income and spending.',
  loading = false,
  error = null,
  height = DEFAULT_CHART_HEIGHT,
  emptyMessage = 'No monthly income or expense data available.',
}) => {
  const chartData = useMemo(() => {
    if (Array.isArray(data) && data.every((item) => item.month)) {
      return data;
    }
    return transformMonthlySummary(data);
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
          <Legend />
          <Bar dataKey="income" name="Income" fill={INCOME_COLOR} radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" name="Expenses" fill={EXPENSE_COLOR} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default IncomeVsExpenseChart;
