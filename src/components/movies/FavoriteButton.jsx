import React from 'react';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const FavoriteButton = ({ movie }) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (isFavorite(movie.id)) {
      await removeFromFavorites(movie.id);
    } else {
      await addToFavorites(movie);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full transition-colors ${
        isFavorite(movie.id)
          ? 'text-red-500 hover:text-red-600'
          : 'text-gray-400 hover:text-red-500'
      }`}
      title={isFavorite(movie.id) ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill={isFavorite(movie.id) ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
};

export default FavoriteButton; 