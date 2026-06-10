import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import IncomeForm from '../components/income/IncomeForm';
import incomeService from '../services/incomeService';

const EditIncome = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await incomeService.getById(id);
        setInitialData(data);
      } catch (err) {
        console.error('Error fetching income details:', err);
        setError(err.message || 'Failed to load income details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIncome();
  }, [id]);

  const handleEditSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await incomeService.update(id, data);
      navigate('/income');
    } catch (err) {
      console.error('Error updating income:', err);
      setError(err.message || 'Failed to update income. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/income');
  };

  return (
    <div className="edit-income-page">
      <div className="page-header">
        <h1>Edit Income</h1>
        <p>Modify the details of your recorded income.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="form-container">
        {isLoading ? (
          <p>Loading income details...</p>
        ) : initialData ? (
          <IncomeForm 
            initialData={initialData} 
            onSubmit={handleEditSubmit} 
            onCancel={handleCancel} 
            submitLabel={isSubmitting ? "Updating..." : "Update Income"} 
          />
        ) : (
          <p>Could not load the income form. Please go back and try again.</p>
        )}
      </div>
    </div>
  );
};

export default EditIncome;
