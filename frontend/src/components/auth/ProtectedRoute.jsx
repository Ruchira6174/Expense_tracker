import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

/**
 * ProtectedRoute wraps routes that require authentication.
 * If the user is not authenticated, they are redirected to /login.
 * While auth state is loading (e.g. token validation on refresh), a loading message is shown.
 */
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while we check the token on initial app load
  if (isLoading) {
    return <div className="auth-loading">Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
