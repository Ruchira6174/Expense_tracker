import React, { useState, useEffect } from 'react';
import SummaryCard from '../components/dashboard/SummaryCard';
import summaryService from '../services/summaryService';

const Dashboard = () => {
  const [summaryData, setSummaryData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    remainingBalance: 0,
    monthlySavings: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await summaryService.getDashboardSummary();
        setSummaryData({
          totalIncome: data.total_income ?? 0,
          totalExpenses: data.total_expenses ?? 0,
          remainingBalance: data.remaining_balance ?? 0,
          monthlySavings: data.monthly_savings ?? 0
        });
      } catch (err) {
        console.error('Error fetching dashboard summary:', err);
        setError(err.message || 'Failed to load dashboard data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here is an overview of your finances.</p>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <section className="summary-cards-container">
        {isLoading ? (
          <p className="loading-text">Loading summary...</p>
        ) : (
          <>
            <SummaryCard 
              title="Total Income" 
              amount={summaryData.totalIncome} 
              type="income" 
            />
            <SummaryCard 
              title="Total Expenses" 
              amount={summaryData.totalExpenses} 
              type="expense" 
            />
            <SummaryCard 
              title="Remaining Balance" 
              amount={summaryData.remainingBalance} 
              type="balance" 
            />
            <SummaryCard 
              title="Monthly Savings" 
              amount={summaryData.monthlySavings} 
              type="savings" 
            />
          </>
        )}
      </section>

      {/* Placeholder for future charts or recent transactions */}
      <section className="dashboard-details">
        <div className="recent-transactions">
          <h2>Recent Transactions</h2>
          <p className="placeholder-text">Transaction list will appear here.</p>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
