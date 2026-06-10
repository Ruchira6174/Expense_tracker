import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="app-layout">
      <header className="app-header">
        <nav>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/expenses">Expenses</Link></li>
            <li><Link to="/income">Income</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/login">Logout</Link></li>
          </ul>
        </nav>
      </header>
      
      <main className="app-content">
        {/* Outlet renders the nested child route components */}
        <Outlet />
      </main>
      
      <footer className="app-footer">
        <p>&copy; 2026 Expense Tracker App</p>
      </footer>
    </div>
  );
};

export default MainLayout;
