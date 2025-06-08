import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, getImageUrl } from '../../services/tmdb';
import WatchlistButton from './WatchlistButton';
import FavoriteButton from './FavoriteButton';
import ReviewForm from '../reviews/ReviewForm';
import ReviewList from '../reviews/ReviewList';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch (err) {
        setError('Failed to load movie details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error || 'Movie not found'}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white">
      <div className="relative h-[60vh]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900"></div>
        <img
          src={getImageUrl(movie.backdrop_path, 'original')}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <img
              src={getImageUrl(movie.poster_path)}
              alt={movie.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          <div className="w-full md:w-2/3">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold">{movie.title}</h1>
              <div className="flex items-center space-x-4">
                <WatchlistButton movie={movie} />
                <FavoriteButton movie={movie} />
              </div>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-yellow-400">
                {movie.vote_average?.toFixed(1)} / 10
              </span>
              <span>{movie.release_date?.split('-')[0]}</span>
              <span>{movie.runtime} min</span>
            </div>

            <p className="text-gray-300 mb-6">{movie.overview}</p>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {movie.genres?.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            {movie.credits?.cast && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Cast</h2>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {movie.credits.cast.slice(0, 6).map((actor) => (
                    <div key={actor.id} className="flex-shrink-0 w-24">
                      <img
                        src={getImageUrl(actor.profile_path, 'w185')}
                        alt={actor.name}
                        className="w-full h-36 object-cover rounded-lg mb-2"
                      />
                      <p className="text-sm font-medium">{actor.name}</p>
                      <p className="text-xs text-gray-400">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {movie.similar?.results && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Similar Movies</h2>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {movie.similar.results.slice(0, 6).map((similarMovie) => (
                    <div
                      key={similarMovie.id}
                      className="flex-shrink-0 w-24 cursor-pointer"
                      onClick={() => navigate(`/movie/${similarMovie.id}`)}
                    >
                      <img
                        src={getImageUrl(similarMovie.poster_path, 'w185')}
                        alt={similarMovie.title}
                        className="w-full h-36 object-cover rounded-lg mb-2"
                      />
                      <p className="text-sm font-medium truncate">
                        {similarMovie.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
          <div className="space-y-8">
            <ReviewForm movieId={movie.id} />
            <ReviewList movieId={movie.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails; 