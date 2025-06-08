import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from '../utils/axios';
import { useAuth } from './AuthContext';

const WatchlistContext = createContext();

export const useWatchlist = () => useContext(WatchlistContext);

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchWatchlist = useCallback(async () => {
    if (!user) {
      setWatchlist([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/watchlist');
      setWatchlist(response.data.movies || []);
    } catch (err) {
      console.error('Error fetching watchlist:', err);
      setError('Failed to fetch watchlist');
      setWatchlist([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addToWatchlist = useCallback(async (movie) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('/api/watchlist/add', {
        tmdbId: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date
      });
      setWatchlist(response.data.movies);
      return { success: true };
    } catch (err) {
      console.error('Error adding to watchlist:', err);
      setError(err.response?.data?.message || 'Failed to add to watchlist');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  }, [user]);

  const removeFromWatchlist = useCallback(async (movieId) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const response = await axios.delete(`/api/watchlist/remove/${movieId}`);
      setWatchlist(response.data.movies);
      return { success: true };
    } catch (err) {
      console.error('Error removing from watchlist:', err);
      setError('Failed to remove from watchlist');
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, [user]);

  const isInWatchlist = useCallback((movie) => {
    if (!movie || !movie.id) return false;
    return watchlist.some(watch => watch.tmdbId === movie.id);
  }, [watchlist]);

  // Fetch watchlist when user changes
  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist, user]);

  const value = {
    watchlist,
    loading,
    error,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    refreshWatchlist: fetchWatchlist
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}; 