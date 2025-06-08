import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../services/tmdb';

const MovieCard = ({ movie }) => {
  const {
    id,
    title,
    poster_path,
    release_date,
    vote_average
  } = movie;

  return (
    <Link to={`/movie/${id}`} className="movie-card">
      <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
        <div className="aspect-[2/3] w-full">
          <img
            src={getImageUrl(poster_path)}
            alt={title}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
            }}
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h3 className="text-lg font-semibold text-white truncate">{title}</h3>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-300">
              {release_date ? new Date(release_date).getFullYear() : 'N/A'}
            </span>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm text-white">{vote_average?.toFixed(1) || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard; 