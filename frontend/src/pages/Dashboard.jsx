import React, { useState, useEffect } from 'react';
import SummaryCard from '../components/dashboard/SummaryCard';
import {
  ExpensePieChart,
  IncomeVsExpenseChart,
  MonthlyExpenseBarChart,
} from '../components/charts';
import summaryService from '../services/summaryService';
import '../styles/dashboard.css';
import '../styles/charts.css';

const Dashboard = () => {
  const [summaryData, setSummaryData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    remainingBalance: 0,
    monthlySavings: 0,
  });
  const [categoryData, setCategoryData] = useState({});
  const [monthlyData, setMonthlyData] = useState({});
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);
  const [isMonthlyLoading, setIsMonthlyLoading] = useState(true);
  const [summaryError, setSummaryError] = useState(null);
  const [categoryError, setCategoryError] = useState(null);
  const [monthlyError, setMonthlyError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsSummaryLoading(true);
        setSummaryError(null);
        const data = await summaryService.getDashboardSummary();
        setSummaryData({
          totalIncome: data.total_income ?? 0,
          totalExpenses: data.total_expenses ?? 0,
          remainingBalance: data.remaining_balance ?? data.balance ?? 0,
          monthlySavings: data.monthly_savings ?? 0,
        });
      } catch (err) {
        console.error('Error fetching dashboard summary:', err);
        setSummaryError(err.message || 'Failed to load dashboard summary.');
      } finally {
        setIsSummaryLoading(false);
      }
    };

    fetchSummary();
  }, []);

  useEffect(() => {
    const fetchCategoryExpenses = async () => {
      try {
        setIsCategoryLoading(true);
        setCategoryError(null);
        const data = await summaryService.getExpensesByCategory();
        setCategoryData(data);
      } catch (err) {
        console.error('Error fetching category expenses:', err);
        setCategoryError(err.message || 'Failed to load category expenses.');
      } finally {
        setIsCategoryLoading(false);
      }
    };

    fetchCategoryExpenses();
  }, []);

  useEffect(() => {
    const fetchMonthlyTrends = async () => {
      try {
        setIsMonthlyLoading(true);
        setMonthlyError(null);
        const data = await summaryService.getMonthlyTrends();
        setMonthlyData(data);
      } catch (err) {
        console.error('Error fetching monthly trends:', err);
        setMonthlyError(err.message || 'Failed to load monthly trends.');
      } finally {
        setIsMonthlyLoading(false);
      }
    };

    fetchMonthlyTrends();
  }, []);

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here is an overview of your finances.</p>
      </header>

      {summaryError && <div className="error-banner">{summaryError}</div>}

      <section className="summary-cards-container">
        {isSummaryLoading ? (
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

      <section className="dashboard-charts">
        <div className="chart-span-4">
          <ExpensePieChart
            data={categoryData}
            loading={isCategoryLoading}
            error={categoryError}
          />
        </div>
        <div className="chart-span-8">
          <IncomeVsExpenseChart
            data={monthlyData}
            loading={isMonthlyLoading}
            error={monthlyError}
          />
        </div>
        <div className="chart-span-12">
          <MonthlyExpenseBarChart
            data={monthlyData}
            loading={isMonthlyLoading}
            error={monthlyError}
          />
        </div>
      </section>

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
