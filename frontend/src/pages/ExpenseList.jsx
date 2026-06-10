import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import expenseService from '../services/expenseService';

const ExpenseList = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await expenseService.getAll();
      setExpenses(data);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError(err.message || 'Failed to fetch expenses.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseService.delete(id);
        // Refresh the list after successful deletion
        fetchExpenses();
      } catch (err) {
        console.error('Error deleting expense:', err);
        alert(err.message || 'Failed to delete expense.');
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/expenses/edit/${id}`);
  };

  return (
    <div className="expense-list-page">
      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1>Expenses</h1>
          <p>Manage and track your outgoing funds.</p>
        </div>
        <Link to="/expenses/add" className="btn-primary">
          + Add Expense
        </Link>
      </div>

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
                <td colSpan="5" className="text-center">No expenses found.</td>
              </tr>
            ) : (
              expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.date}</td>
                  <td>{expense.title}</td>
                  <td><span className={`badge badge-${expense.category.toLowerCase()}`}>{expense.category}</span></td>
                  <td className="amount-expense">
                    ${Number(expense.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
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
