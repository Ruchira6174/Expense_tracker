import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IncomeForm from '../components/income/IncomeForm';
import incomeService from '../services/incomeService';

const AddIncome = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleAddSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await incomeService.create(data);
      // Redirect back to income list upon success
      navigate('/income');
    } catch (err) {
      console.error('Error creating income:', err);
      setError(err.message || 'Failed to create income. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/income');
  };

  return (
    <div className="add-income-page">
      <div className="page-header">
        <h1>Add New Income</h1>
        <p>Record a new source of incoming funds.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="form-container">
        <IncomeForm 
          onSubmit={handleAddSubmit} 
          onCancel={handleCancel} 
          submitLabel={isSubmitting ? "Adding..." : "Add Income"} 
        />
      </div>
    </div>
  );
};

export default AddIncome;
