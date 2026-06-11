import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import { getToken, removeToken } from '../utils/tokenStorage';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const establishSession = useCallback(async (authResponse, fallbackEmail) => {
    let profile = authResponse?.user;

    if (!profile) {
      profile = await authService.getProfile();
    }

    setUser(profile || { email: fallbackEmail });
    setIsAuthenticated(true);
    return profile;
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await authService.getProfile();
        setUser(userData);
        setIsAuthenticated(true);
      } catch {
        removeToken();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    await establishSession(data, credentials.email);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);

    if (getToken()) {
      await establishSession(data, userData.email);
    }

    return data;
  };

  const logout = () => {
    clearSession();
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
