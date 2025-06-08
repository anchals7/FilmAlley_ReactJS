import React from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import { Link } from 'react-router-dom';

const Watchlist = () => {
  const { watchlist, loading, error } = useWatchlist();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="page-heading mb-8">My Watchlist</h1>

      {watchlist.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Your watchlist is empty.</p>
          <Link
            to="/"
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
          >
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {watchlist.map(movie => (
            <Link
              key={movie.tmdbId}
              to={`/movie/${movie.tmdbId}`}
              className="group"
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity" />
              </div>
              <h3 className="mt-2 text-lg font-semibold group-hover:text-blue-500 transition-colors">
                {movie.title}
              </h3>
              {movie.releaseDate && (
                <p className="text-gray-600">
                  {new Date(movie.releaseDate).getFullYear()}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist; 