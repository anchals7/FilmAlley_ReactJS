import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const { favorites, loading, error } = useFavorites();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="page-heading mb-8">My Favorites</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-700 rounded-lg overflow-hidden">
                <div className="aspect-[2/3] bg-gray-600"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="page-heading mb-8">My Favorites</h1>
        <div className="text-red-500 text-center py-4">{error}</div>
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="page-heading mb-8">My Favorites</h1>
        <div className="text-center py-8">
          <p className="text-gray-400 text-lg">No favorite movies yet</p>
          <p className="text-gray-500 mt-2">Start adding movies to your favorites!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="page-heading mb-8">My Favorites</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.map((movie) => (
          <Link
            key={movie.tmdbId}
            to={`/movie/${movie.tmdbId}`}
            className="group"
          >
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105">
              <div className="aspect-[2/3] relative">
                {movie.posterPath ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400">No poster available</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">
                  {movie.title}
                </h3>
                {movie.releaseDate && (
                  <p className="text-gray-400 text-sm">
                    {new Date(movie.releaseDate).getFullYear()}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Favorites; 