import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from '../utils/axios';

const ReviewsContext = createContext();

export const useReviews = () => useContext(ReviewsContext);

export const ReviewsProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async (movieId) => {
    if (!movieId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/reviews/movie/${movieId}`);
      setReviews(response.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      // If it's a 404, treat it as no reviews rather than an error
      if (err.response?.status === 404) {
        setReviews([]);
        setError(null);
      } else {
        setError(err.response?.data?.message || 'Failed to fetch reviews');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const submitReview = useCallback(async (movieId, reviewData) => {
    if (!movieId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`/api/reviews/movie/${movieId}`, reviewData);
      // After successful submission, fetch updated reviews
      await fetchReviews(movieId);
      return { success: true };
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.response?.data?.message || 'Failed to submit review');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  }, [fetchReviews]);

  const updateReview = useCallback(async (movieId, reviewId, reviewData) => {
    if (!movieId || !reviewId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/api/reviews/movie/${movieId}`, reviewData);
      setReviews(prev => prev.map(review => 
        review._id === reviewId ? response.data : review
      ));
      return { success: true };
    } catch (err) {
      console.error('Error updating review:', err);
      setError(err.response?.data?.message || 'Failed to update review');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteReview = useCallback(async (movieId) => {
    if (!movieId) return;
    
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/reviews/movie/${movieId}`);
      setReviews(prev => prev.filter(review => review.movieId !== movieId));
      return { success: true };
    } catch (err) {
      console.error('Error deleting review:', err);
      setError(err.response?.data?.message || 'Failed to delete review');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    reviews,
    loading,
    error,
    fetchReviews,
    submitReview,
    updateReview,
    deleteReview
  };

  return (
    <ReviewsContext.Provider value={value}>
      {children}
    </ReviewsContext.Provider>
  );
}; 