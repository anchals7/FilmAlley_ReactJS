import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  return (
    <Link to={`/movie/${movie.id}`} className="block">
      <div className="relative group">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-auto rounded-lg transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 rounded-lg flex items-center justify-center">
          <div className="text-center p-4">
            <h3 className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xl font-bold mb-2">
              {movie.title}
            </h3>
            <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {new Date(movie.release_date).getFullYear()}
            </p>
            {movie.vote_average > 0 && (
              <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2">
                Rating: {movie.vote_average.toFixed(1)}/10
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard; 