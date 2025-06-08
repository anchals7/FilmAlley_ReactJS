import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '../utils/axios';
import { useAuth } from './AuthContext';

const RecommendationsContext = createContext();

export const useRecommendations = () => {
  const context = useContext(RecommendationsContext);
  if (!context) {
    throw new Error('useRecommendations must be used within a RecommendationsProvider');
  }
  return context;
};

export const RecommendationsProvider = ({ children }) => {
  const { user } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['recommendations', user?.id],
    queryFn: async () => {
      if (!user) {
        throw new Error('User must be authenticated to fetch recommendations');
      }
      const response = await axios.get('/api/recommendations', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    },
    enabled: !!user,
  });

  const value = {
    recommendations: data?.results || [],
    isLoading,
    error,
    fetchRecommendations: refetch,
  };

  return (
    <RecommendationsContext.Provider value={value}>
      {children}
    </RecommendationsContext.Provider>
  );
};

export default RecommendationsContext; 