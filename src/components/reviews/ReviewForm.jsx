import React, { useState } from 'react';
import { useReviews } from '../../context/ReviewsContext';
import { useAuth } from '../../context/AuthContext';

const ReviewForm = ({ movieId }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const { submitReview, loading, error } = useReviews();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to submit a review');
      return;
    }
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    if (!review.trim()) {
      alert('Please write a review');
      return;
    }

    const result = await submitReview(movieId, { rating, review });
    if (result.success) {
      setRating(0);
      setReview('');
    }
  };

  if (!user) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-400">Please log in to write a review</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Rating
        </label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
            >
              <svg
                className={`w-8 h-8 ${
                  star <= (hoveredRating || rating)
                    ? 'text-yellow-400'
                    : 'text-gray-600'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="review" className="block text-sm font-medium text-gray-300 mb-2">
          Your Review
        </label>
        <textarea
          id="review"
          rows="4"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Write your review here..."
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${
          loading
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-primary hover:bg-primary/90'
        }`}
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm; 