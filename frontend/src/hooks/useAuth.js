import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook to access authentication state and actions.
 * Must be used within a component wrapped by AuthProvider.
 * 
 * Returns: { user, isAuthenticated, isLoading, login, register, logout }
 */
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
