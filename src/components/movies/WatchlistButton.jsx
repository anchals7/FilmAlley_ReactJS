import React from 'react';
import { useWatchlist } from '../../context/WatchlistContext';

const WatchlistButton = ({ movie }) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist, loading } = useWatchlist();
  const inWatchlist = isInWatchlist(movie.id);

  const handleClick = async () => {
    if (inWatchlist) {
      await removeFromWatchlist(movie.id);
    } else {
      await addToWatchlist(movie);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
        inWatchlist
          ? 'bg-red-600 hover:bg-red-700 text-white'
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      }`}
    >
      {inWatchlist ? (
        <>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>Remove from Watchlist</span>
        </>
      ) : (
        <>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Add to Watchlist</span>
        </>
      )}
    </button>
  );
};

export default WatchlistButton; 