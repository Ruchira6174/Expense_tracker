import { Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import ExpenseList from '../pages/ExpenseList';
import AddExpense from '../pages/AddExpense';
import EditExpense from '../pages/EditExpense';
import IncomeList from '../pages/IncomeList';
import AddIncome from '../pages/AddIncome';
import EditIncome from '../pages/EditIncome';
import Profile from '../pages/Profile/Profile';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses" element={<ExpenseList />} />
          <Route path="/expenses/add" element={<AddExpense />} />
          <Route path="/expenses/edit/:id" element={<EditExpense />} />
          <Route path="/income" element={<IncomeList />} />
          <Route path="/income/add" element={<AddIncome />} />
          <Route path="/income/edit/:id" element={<EditIncome />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
