import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from '../utils/axios';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/favorites');
      setFavorites(res.data.movies || []);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError(err.response?.data?.message || 'Failed to fetch favorites');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addToFavorites = useCallback(async (movie) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/favorites/add', {
        tmdbId: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date
      });
      setFavorites(res.data.movies || []);
      return { success: true };
    } catch (err) {
      console.error('Error adding to favorites:', err);
      setError(err.response?.data?.message || 'Failed to add to favorites');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  }, [user]);

  const removeFromFavorites = useCallback(async (movieId) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const res = await axios.delete(`/api/favorites/remove/${movieId}`);
      setFavorites(res.data.movies || []);
      return { success: true };
    } catch (err) {
      console.error('Error removing from favorites:', err);
      setError(err.response?.data?.message || 'Failed to remove from favorites');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  }, [user]);

  const isFavorite = useCallback((movie) => {
    if (!movie || !movie.id) return false;
    return favorites.some(fav => fav.tmdbId === movie.id);
  }, [favorites]);

  // Fetch favorites on mount and when user changes
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites, user]);

  const value = {
    favorites,
    loading,
    error,
    fetchFavorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesContext; 