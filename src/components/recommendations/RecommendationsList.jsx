import React from 'react';
import { Link } from 'react-router-dom';
import { useRecommendations } from '../../context/RecommendationsContext';

function RecommendationsList() {
  const { recommendations, isLoading, error } = useRecommendations();

  if (isLoading) {
    return <div className="loading">Loading recommendations...</div>;
  }

  if (error) {
    return <div className="error">Error: {error.message}</div>;
  }

  if (!recommendations || recommendations.length === 0) {
    return <div className="loading">No recommendations available yet.</div>;
  }

  return (
    <div className="content">
      {recommendations.map((movie) => (
        <Link
          key={movie.id}
          to={`/movie/${movie.id}`}
          className="card"
        >
          <div>
            <h3>{movie.title}</h3>
          </div>
          <div>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
          </div>
          <div>
            <span>{new Date(movie.release_date).getFullYear()}</span>
            <h3>{movie.title}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default RecommendationsList; 