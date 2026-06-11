import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpenseForm from '../components/expenses/ExpenseForm';
import expenseService from '../services/expenseService';

const AddExpense = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleAddSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await expenseService.create(data);
      // Redirect back to expense list upon success
      navigate('/expenses');
    } catch (err) {
      console.error('Error creating expense:', err);
      setError(err.message || 'Failed to create expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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

      {error && <div className="error-banner">{error}</div>}

      <div className="form-container">
        <ExpenseForm 
          onSubmit={handleAddSubmit} 
          onCancel={handleCancel} 
          submitLabel={isSubmitting ? "Adding..." : "Add Expense"} 
        />
      </div>
    </div>
  );
};

export default AddExpense;
