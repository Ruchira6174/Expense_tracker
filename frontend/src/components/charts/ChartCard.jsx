import React from 'react';

const ChartCard = ({
  title,
  description,
  loading = false,
  error = null,
  isEmpty = false,
  emptyMessage = 'No data available for this chart.',
  children,
  className = '',
}) => {
  return (
    <div className={`chart-card ${className}`.trim()}>
      <div className="chart-card-header">
        <h3 className="chart-card-title">{title}</h3>
        {description && <p className="chart-card-description">{description}</p>}
      </div>

      <div className="chart-card-body">
        {loading && <p className="chart-state-message">Loading chart...</p>}
        {!loading && error && <p className="chart-state-message chart-state-error">{error}</p>}
        {!loading && !error && isEmpty && (
          <p className="chart-state-message">{emptyMessage}</p>
        )}
        {!loading && !error && !isEmpty && children}
      </div>
    </div>
  );
};

export default ChartCard;
