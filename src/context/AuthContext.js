import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    // Check if we have a session cookie before making the request
    const hasSessionCookie = document.cookie.includes('connect.sid');
    if (!hasSessionCookie) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('/api/auth/me');
      setUser(response.data);
      setError(null);
    } catch (error) {
      // Don't set error for 401 as it's expected when not logged in
      if (error.response?.status !== 401) {
        console.error('Error fetching user:', error);
        setError(error.response?.data?.message || 'Error fetching user');
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      setUser(response.data);
      setError(null);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      setUser(response.data);
      setError(null);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      // Clear user state and any stored tokens
      setUser(null);
      setError(null);
      // Clear any stored tokens or cookies
      localStorage.removeItem('token');
      // Clear session cookie
      document.cookie = 'connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    } catch (error) {
      console.error('Logout error:', error);
      setError(error.response?.data?.message || 'Logout failed');
      // Even if the server request fails, clear the local state
      setUser(null);
      localStorage.removeItem('token');
      document.cookie = 'connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 