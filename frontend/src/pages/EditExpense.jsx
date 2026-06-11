import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ExpenseForm from '../components/expenses/ExpenseForm';
import expenseService from '../services/expenseService';

const EditExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await expenseService.getById(id);
        setInitialData(data);
      } catch (err) {
        console.error('Error fetching expense details:', err);
        setError(err.message || 'Failed to load expense details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpense();
  }, [id]);

  const handleEditSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await expenseService.update(id, data);
      navigate('/expenses');
    } catch (err) {
      console.error('Error updating expense:', err);
      setError(err.message || 'Failed to update expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/expenses');
  };

  return (
    <div className="edit-expense-page">
      <div className="page-header">
        <h1>Edit Expense</h1>
        <p>Modify the details of your recorded transaction.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="form-container">
        {isLoading ? (
          <p>Loading expense details...</p>
        ) : initialData ? (
          <ExpenseForm 
            initialData={initialData} 
            onSubmit={handleEditSubmit} 
            onCancel={handleCancel} 
            submitLabel={isSubmitting ? "Updating..." : "Update Expense"} 
          />
        ) : (
          <p>Could not load the expense form. Please go back and try again.</p>
        )}
      </div>
    </div>
  );
};

export default EditExpense;
