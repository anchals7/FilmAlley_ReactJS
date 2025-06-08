import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useWatchlist } from '../context/WatchlistContext';
import { useReviews } from '../context/ReviewsContext';
import ReviewList from '../components/reviews/ReviewList';
import ReviewForm from '../components/reviews/ReviewForm';

function MovieDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { reviews, fetchReviews } = useReviews();

  const { data: movie, isLoading, error } = useQuery({
    queryKey: ['movie', id],
    queryFn: async () => {
      const response = await axios.get(`/api/movies/${id}`);
      return response.data;
    },
  });

  React.useEffect(() => {
    if (id) {
      fetchReviews(id);
    }
  }, [id, fetchReviews]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error.message}</div>;
  }

  if (!movie) {
    return <div className="error">Movie not found</div>;
  }

  const handleFavoriteClick = async () => {
    try {
      if (isFavorite(movie)) {
        await removeFromFavorites(movie.id);
      } else {
        await addToFavorites(movie);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleWatchlistClick = async () => {
    try {
      if (isInWatchlist(movie)) {
        await removeFromWatchlist(movie.id);
      } else {
        await addToWatchlist(movie);
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-full aspect-[2/3] bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">No poster available</span>
            </div>
          )}
        </div>
        <div className="w-full md:w-2/3">
          <h1 className="page-heading mb-4">{movie.title}</h1>
          <p className="text-gray-400 mb-4">
            {new Date(movie.release_date).getFullYear()}
          </p>
          <p className="text-gray-300 mb-6">{movie.overview}</p>
          
          {user && (
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleFavoriteClick}
                className="btn btn-secondary"
                title={isFavorite(movie) ? "Remove from Favorites" : "Add to Favorites"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill={isFavorite(movie) ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={isFavorite(movie) ? "0" : "2"}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
              <button
                onClick={handleWatchlistClick}
                className={`btn ${isInWatchlist(movie) ? 'btn-primary' : 'btn-secondary'}`}
              >
                {isInWatchlist(movie) ? 'Remove from Watchlist' : 'Add to Watchlist'}
              </button>
            </div>
          )}

          {user && <ReviewForm movieId={id} />}
          <ReviewList movieId={id} />
        </div>
      </div>
    </div>
  );
}

export default MovieDetails; 