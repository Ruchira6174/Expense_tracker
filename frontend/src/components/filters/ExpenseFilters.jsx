import { EXPENSE_CATEGORIES } from '../../constants/expenseCategories';

const ExpenseFilters = ({ filters, onChange, onClear, hasActiveFilters }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <div className="list-filters">
      <div className="filter-group">
        <label htmlFor="expense-title-search">Search by title</label>
        <input
          type="search"
          id="expense-title-search"
          name="title"
          value={filters.title}
          onChange={handleChange}
          placeholder="Search expenses..."
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="expense-category-filter">Category</label>
        <select
          id="expense-category-filter"
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="filter-select"
        >
          <option value="">All categories</option>
          {EXPENSE_CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="expense-date-filter">Date</label>
        <input
          type="date"
          id="expense-date-filter"
          name="date"
          value={filters.date}
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

export default ExpenseFilters;
