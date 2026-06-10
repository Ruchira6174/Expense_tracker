import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ExpenseForm from '../components/expenses/ExpenseForm';

const EditExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    // Simulate fetching the expense data by ID from an API
    console.log('Fetching data for expense ID:', id);
    
    // Dummy data matching the list in ExpenseList.jsx for demonstration
    const dummyDatabase = {
      1: { title: 'Groceries', amount: 85.50, category: 'Food', date: '2026-06-10', description: 'Weekly grocery run' },
      2: { title: 'Gas Station', amount: 45.00, category: 'Transportation', date: '2026-06-09', description: 'Fill up tank' },
      3: { title: 'Internet Bill', amount: 60.00, category: 'Utilities', date: '2026-06-05', description: 'Monthly fiber internet' },
    };

    if (dummyDatabase[id]) {
      setInitialData(dummyDatabase[id]);
    } else {
      // If not found in dummy data, fallback to empty or redirect
      // For this demo, we'll just redirect back if not found
      // navigate('/expenses');
    }
  }, [id]);

  const handleEditSubmit = (data) => {
    console.log(`Updating expense ID ${id} with:`, data);
    // Here you would typically make a PUT API call to update the data
    navigate('/expenses');
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

      <div className="form-container">
        {initialData ? (
          <ExpenseForm 
            initialData={initialData} 
            onSubmit={handleEditSubmit} 
            onCancel={handleCancel} 
            submitLabel="Update Expense" 
          />
        ) : (
          <p>Loading expense details...</p>
        )}
      </div>
    </div>
  );
};

export default EditExpense;
