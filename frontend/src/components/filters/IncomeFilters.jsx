import React from 'react';

const IncomeFilters = ({ filters, onChange, onClear, hasActiveFilters }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <div className="list-filters">
      <div className="filter-group">
        <label htmlFor="income-source-search">Search by source</label>
        <input
          type="search"
          id="income-source-search"
          name="source"
          value={filters.source}
          onChange={handleChange}
          placeholder="Search income sources..."
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="income-month-filter">Month</label>
        <input
          type="month"
          id="income-month-filter"
          name="month"
          value={filters.month}
          onChange={handleChange}
          className="filter-input"
        />
      </div>

      {hasActiveFilters && (
        <button type="button" className="btn-secondary filter-clear-btn" onClick={onClear}>
          Clear filters
        </button>
      )}
    </div>
  );
};

export default IncomeFilters;
