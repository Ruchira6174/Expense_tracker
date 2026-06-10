import React from 'react';
import SummaryCard from '../components/dashboard/SummaryCard';

const Dashboard = () => {
  const summaryData = {
    totalIncome: 50000,
    totalExpenses: 30000,
    remainingBalance: 20000,
    monthlySavings: 15000
  };

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here is an overview of your finances.</p>
      </header>

      <section className="summary-cards-container">
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
