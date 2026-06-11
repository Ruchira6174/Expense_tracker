import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ExpenseFilters from '../components/filters/ExpenseFilters';
import useDebouncedValue from '../hooks/useDebouncedValue';
import expenseService from '../services/expenseService';
import { formatCurrency } from '../utils/helpers';
import {
  buildExpenseQueryParams,
  filterExpenses,
  hasActiveExpenseFilters,
  normalizeListResponse,
} from '../utils/filters';
import '../styles/list-pages.css';

const INITIAL_FILTERS = {
  title: '',
  category: '',
  date: '',
};

const ExpenseList = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const debouncedTitle = useDebouncedValue(filters.title);

  const activeFilters = {
    ...filters,
    title: debouncedTitle,
  };

  const fetchExpenses = useCallback(async (currentFilters) => {
    try {
      setIsLoading(true);
      setError(null);

      const params = buildExpenseQueryParams(currentFilters);
      const data = await expenseService.getAll(params);
      const normalized = normalizeListResponse(data);
      setExpenses(filterExpenses(normalized, currentFilters));
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError(err.message || 'Failed to fetch expenses.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses(activeFilters);
  }, [activeFilters.title, activeFilters.category, activeFilters.date, fetchExpenses]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseService.delete(id);
        fetchExpenses(activeFilters);
      } catch (err) {
        console.error('Error deleting expense:', err);
        alert(err.message || 'Failed to delete expense.');
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/expenses/edit/${id}`);
  };

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const showActiveFilters = hasActiveExpenseFilters(activeFilters);

  return (
    <div className="expense-list-page">
      <div className="page-header">
        <div>
          <h1>Expenses</h1>
          <p>Manage and track your outgoing funds.</p>
        </div>
        <Link to="/expenses/add" className="btn-primary">
          + Add Expense
        </Link>
      </div>

      <ExpenseFilters
        filters={filters}
        onChange={setFilters}
        onClear={handleClearFilters}
        hasActiveFilters={showActiveFilters}
      />

      {showActiveFilters && (
        <p className="filter-summary">
          Showing {expenses.length} result{expenses.length === 1 ? '' : 's'}
        </p>
      )}

      {error && <div className="error-banner">{error}</div>}

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="text-center">Loading expenses...</td>
              </tr>
            ) : expenses.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  {showActiveFilters ? 'No expenses match your filters.' : 'No expenses found.'}
                </td>
              </tr>
            ) : (
              expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.date}</td>
                  <td>{expense.title}</td>
                  <td>
                    <span className={`badge badge-${expense.category?.toLowerCase()}`}>
                      {expense.category}
                    </span>
                  </td>
                  <td className="amount-expense">{formatCurrency(expense.amount)}</td>
                  <td className="actions-cell">
                    <button onClick={() => handleEdit(expense.id)} className="btn-icon edit-btn">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(expense.id)} className="btn-icon delete-btn">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseList;
