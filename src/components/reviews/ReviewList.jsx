import React, { useEffect } from 'react';
import { useReviews } from '../../context/ReviewsContext';

const ReviewList = ({ movieId }) => {
  const { reviews, loading, error, fetchReviews } = useReviews();

  useEffect(() => {
    if (movieId) {
      fetchReviews(movieId);
    }
  }, [movieId]); // Only re-fetch when movieId changes

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gray-600 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-600 rounded w-1/4"></div>
                <div className="h-3 bg-gray-600 rounded w-1/2 mt-2"></div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-4 bg-gray-600 rounded"></div>
              <div className="h-4 bg-gray-600 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && error !== 'No reviews found') {
    return (
      <div className="text-red-500 text-center py-4">
        {error}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 text-lg">No reviews yet</p>
        <p className="text-gray-500 mt-2">Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review._id} className="bg-gray-800/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">
                  {review.user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-gray-200">{review.user.username}</h4>
                <p className="text-sm text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < review.rating ? 'text-yellow-400' : 'text-gray-600'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          <p className="text-gray-300 whitespace-pre-wrap">{review.review}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList; 