import React, { useMemo } from 'react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import ChartCard from './ChartCard';
import ChartTooltip from './ChartTooltip';
import { CHART_COLORS, DEFAULT_CHART_HEIGHT } from '../../constants/charts';
import { transformCategoryExpenses } from '../../utils/chartData';

const ExpensePieChart = ({
  data,
  title = 'Expenses by Category',
  description = 'Breakdown of spending across categories.',
  loading = false,
  error = null,
  height = DEFAULT_CHART_HEIGHT,
  emptyMessage = 'No category expenses recorded yet.',
}) => {
  const chartData = useMemo(() => {
    if (Array.isArray(data)) {
      return data.filter((item) => Number(item.value) > 0);
    }
    return transformCategoryExpenses(data);
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
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
          >
            {chartData.map((entry, index) => (
              <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default ExpensePieChart;
