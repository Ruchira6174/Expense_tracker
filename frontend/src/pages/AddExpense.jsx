import React from 'react';
import { useNavigate } from 'react-router-dom';
import ExpenseForm from '../components/expenses/ExpenseForm';

const AddExpense = () => {
  const navigate = useNavigate();

  const handleAddSubmit = (data) => {
    console.log('Adding new expense:', data);
    // Here you would typically make an API call to save the data
    // For now, we simulate a successful save and redirect
    navigate('/expenses');
  };

  const handleCancel = () => {
    navigate('/expenses');
  };

  return (
    <div className="add-expense-page">
      <div className="page-header">
        <h1>Add New Expense</h1>
        <p>Record a new transaction to track your spending.</p>
      </div>

      <div className="form-container">
        <ExpenseForm 
          onSubmit={handleAddSubmit} 
          onCancel={handleCancel} 
          submitLabel="Add Expense" 
        />
      </div>
    </div>
  );
};

export default AddExpense;
