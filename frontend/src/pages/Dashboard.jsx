import { useState, useEffect } from 'react';
import SummaryCard from '../components/dashboard/SummaryCard';
import {
  ExpensePieChart,
  IncomeVsExpenseChart,
  MonthlyExpenseBarChart,
} from '../components/charts';
import exportService from '../services/exportService';
import summaryService from '../services/summaryService';
import '../styles/list-pages.css';
import '../styles/dashboard.css';
import '../styles/charts.css';
import { formatCurrency } from '../utils/helpers';

const Dashboard = () => {
  const [summaryData, setSummaryData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    remainingBalance: 0,
    monthlySavings: 0,
  });
  const [categoryData, setCategoryData] = useState({});
  const [monthlyData, setMonthlyData] = useState({});
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);
  const [isMonthlyLoading, setIsMonthlyLoading] = useState(true);
  const [isRecentLoading, setIsRecentLoading] = useState(true);
  const [isExportingReport, setIsExportingReport] = useState(false);
  const [summaryError, setSummaryError] = useState(null);
  const [categoryError, setCategoryError] = useState(null);
  const [monthlyError, setMonthlyError] = useState(null);
  const [recentError, setRecentError] = useState(null);

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

  const handleExportMonthlyReport = async () => {
    try {
      setIsExportingReport(true);
      await exportService.exportMonthlyReportPdf();
    } catch (err) {
      console.error('Error exporting monthly report:', err);
      alert(err.message || 'Failed to export monthly report.');
    } finally {
      setIsExportingReport(false);
    }
  };

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

  useEffect(() => {
    const fetchRecentTransactions = async () => {
      try {
        setIsRecentLoading(true);
        setRecentError(null);
        const data = await summaryService.getRecentTransactions();
        setRecentTransactions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching recent transactions:', err);
        setRecentError(err.message || 'Failed to load recent transactions.');
      } finally {
        setIsRecentLoading(false);
      }
    };

    fetchRecentTransactions();
  }, []);

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here is an overview of your finances.</p>
        </div>
        <button
          type="button"
          className="btn-secondary"
          onClick={handleExportMonthlyReport}
          disabled={isExportingReport}
        >
          {isExportingReport ? 'Exporting...' : 'Export PDF'}
        </button>
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
          {isRecentLoading ? (
            <p className="loading-text">Loading recent transactions...</p>
          ) : recentError ? (
            <p className="chart-state-error">{recentError}</p>
          ) : recentTransactions.length === 0 ? (
            <p className="placeholder-text">No recent transactions found.</p>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((transaction) => (
                    <tr key={`${transaction.type}-${transaction.id}`}>
                      <td>{transaction.date}</td>
                      <td>{transaction.title}</td>
                      <td>{transaction.type}</td>
                      <td className={transaction.type === 'income' ? 'amount-income' : 'amount-expense'}>
                        {formatCurrency(transaction.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
