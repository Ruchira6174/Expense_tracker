import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import IncomeFilters from '../components/filters/IncomeFilters';
import useDebouncedValue from '../hooks/useDebouncedValue';
import exportService from '../services/exportService';
import incomeService from '../services/incomeService';
import { formatCurrency } from '../utils/helpers';
import {
  buildIncomeQueryParams,
  filterIncome,
  hasActiveIncomeFilters,
  normalizeListResponse,
} from '../utils/filters';
import '../styles/list-pages.css';

const INITIAL_FILTERS = {
  source: '',
  month: '',
};

const IncomeList = () => {
  const navigate = useNavigate();
  const [incomes, setIncomes] = useState([]);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);
  const debouncedSource = useDebouncedValue(filters.source);

  const activeFilters = useMemo(() => ({
    ...filters,
    source: debouncedSource,
  }), [filters, debouncedSource]);

  const fetchIncomes = useCallback(async (currentFilters) => {
    try {
      setIsLoading(true);
      setError(null);

      const params = buildIncomeQueryParams(currentFilters);
      const data = await incomeService.getAll(params);
      const normalized = normalizeListResponse(data);
      setIncomes(filterIncome(normalized, currentFilters));
    } catch (err) {
      console.error('Error fetching incomes:', err);
      setError(err.message || 'Failed to fetch income records.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncomes(activeFilters);
  }, [activeFilters, fetchIncomes]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this income entry?')) {
      try {
        await incomeService.delete(id);
        fetchIncomes(activeFilters);
      } catch (err) {
        console.error('Error deleting income:', err);
        alert(err.message || 'Failed to delete income.');
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/income/edit/${id}`);
  };

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportService.exportIncomeCsv();
    } catch (err) {
      console.error('Error exporting income:', err);
      alert(err.message || 'Failed to export income.');
    } finally {
      setIsExporting(false);
    }
  };

  const showActiveFilters = hasActiveIncomeFilters(activeFilters);

  return (
    <div className="income-list-page">
      <div className="page-header">
        <div>
          <h1>Income</h1>
          <p>Manage and track your incoming funds.</p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn-secondary" onClick={handleExport} disabled={isExporting}>
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </button>
          <Link to="/income/add" className="btn-primary">
            + Add Income
          </Link>
        </div>
      </div>

      <IncomeFilters
        filters={filters}
        onChange={setFilters}
        onClear={handleClearFilters}
        hasActiveFilters={showActiveFilters}
      />

      {showActiveFilters && (
        <p className="filter-summary">
          Showing {incomes.length} result{incomes.length === 1 ? '' : 's'}
        </p>
      )}

      {error && <div className="error-banner">{error}</div>}

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Source</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4" className="text-center">Loading income records...</td>
              </tr>
            ) : incomes.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  {showActiveFilters ? 'No income records match your filters.' : 'No income records found.'}
                </td>
              </tr>
            ) : (
              incomes.map((income) => (
                <tr key={income.id}>
                  <td>{income.date}</td>
                  <td>{income.source}</td>
                  <td className="amount-income">{formatCurrency(income.amount)}</td>
                  <td className="actions-cell">
                    <button onClick={() => handleEdit(income.id)} className="btn-icon edit-btn">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(income.id)} className="btn-icon delete-btn">
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

export default IncomeList;
