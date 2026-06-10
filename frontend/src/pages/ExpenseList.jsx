import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ExpenseList = () => {
  const navigate = useNavigate();
  // Dummy local state for UI demonstration
  const [expenses, setExpenses] = useState([
    { id: 1, title: 'Groceries', amount: 85.50, category: 'Food', date: '2026-06-10', description: 'Weekly grocery run' },
    { id: 2, title: 'Gas Station', amount: 45.00, category: 'Transportation', date: '2026-06-09', description: 'Fill up tank' },
    { id: 3, title: 'Internet Bill', amount: 60.00, category: 'Utilities', date: '2026-06-05', description: 'Monthly fiber internet' },
  ]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpenses(expenses.filter(expense => expense.id !== id));
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
            {expenses.length === 0 ? (
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
                    ${expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
