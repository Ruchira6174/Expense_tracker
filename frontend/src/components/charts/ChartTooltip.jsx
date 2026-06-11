import { formatCurrency } from '../../utils/helpers';

const ChartTooltip = ({ active, payload, label, valueFormatter = formatCurrency }) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="chart-tooltip">
      {label && <p className="chart-tooltip-label">{label}</p>}
      <ul className="chart-tooltip-list">
        {payload.map((entry) => (
          <li key={entry.name} style={{ color: entry.color }}>
            <span>{entry.name}: </span>
            <strong>{valueFormatter(entry.value)}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChartTooltip;
