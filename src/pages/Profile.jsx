import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useWatchlist } from '../context/WatchlistContext';
import MovieCard from '../components/MovieCard';

const Profile = () => {
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const { watchlist } = useWatchlist();

  // Transform movie data to match MovieCard expectations
  const transformMovie = (movie) => ({
    id: movie.tmdbId,
    title: movie.title,
    poster_path: movie.posterPath,
    release_date: movie.releaseDate,
    vote_average: movie.voteAverage || 0
  });

  // Get the most recent favorite
  const mostRecentFavorite = favorites.length > 0 ? transformMovie(favorites[0]) : null;
  
  // Get a random movie from watchlist for "what to watch next"
  const nextToWatch = watchlist.length > 0 
    ? transformMovie(watchlist[Math.floor(Math.random() * watchlist.length)]) 
    : null;

  const greetings = [
    `Hey there, ${user?.username || 'Movie Lover'}!`,
    `Ready to watch movies, ${user?.username || 'Movie Lover'}?`,
    `Welcome back, ${user?.username || 'Movie Lover'}!`,
    `Movie night, ${user?.username || 'Movie Lover'}?`,
    `What's on your watchlist today, ${user?.username || 'Movie Lover'}?`
  ];

  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-[#f9d3b4] mb-8">{randomGreeting}</h1>
        
        {/* Most Recent Favorite */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Your Most Recent Love</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {mostRecentFavorite ? (
              <MovieCard movie={mostRecentFavorite} />
            ) : (
              <p className="text-gray-400">You haven't favorited any movies yet.</p>
            )}
          </div>
        </div>

        {/* What to Watch Next */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-6">What to Watch Next</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {nextToWatch ? (
              <MovieCard movie={nextToWatch} />
            ) : (
              <p className="text-gray-400">Your watchlist is empty. Time to add some movies!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 