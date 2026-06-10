import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import incomeService from '../services/incomeService';

const IncomeList = () => {
  const navigate = useNavigate();
  const [incomes, setIncomes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIncomes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await incomeService.getAll();
      setIncomes(data);
    } catch (err) {
      console.error('Error fetching incomes:', err);
      setError(err.message || 'Failed to fetch income records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this income entry?')) {
      try {
        await incomeService.delete(id);
        // Refresh the list after successful deletion
        fetchIncomes();
      } catch (err) {
        console.error('Error deleting income:', err);
        alert(err.message || 'Failed to delete income.');
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/income/edit/${id}`);
  };

  return (
    <div className="income-list-page">
      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1>Income</h1>
          <p>Manage and track your incoming funds.</p>
        </div>
        <Link to="/income/add" className="btn-primary">
          + Add Income
        </Link>
      </div>

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
                <td colSpan="4" className="text-center">No income records found.</td>
              </tr>
            ) : (
              incomes.map((income) => (
                <tr key={income.id}>
                  <td>{income.date}</td>
                  <td>{income.source}</td>
                  <td className="amount-income">
                    +${Number(income.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
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
