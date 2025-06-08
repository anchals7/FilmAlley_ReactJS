import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import { API_BASE_URL } from '../config';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setSubmittedQuery(searchQuery);
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    setSubmittedQuery(''); // Clear search query when selecting genre
  };

  // Movie search query
  const { data: searchResults, isLoading: isSearchLoading, error: searchError } = useQuery({
    queryKey: ['search', submittedQuery],
    queryFn: async () => {
      if (!submittedQuery) return null;

      console.log('Making search request:', { type: 'movie', query: submittedQuery });
      
      try {
        const response = await axios.get(`${API_BASE_URL}/api/movies/search`, {
          params: {
            type: 'movie',
            query: submittedQuery,
            page: 1
          }
        });
        console.log('Search response:', {
          status: response.status,
          resultsCount: response.data?.results?.length,
          data: response.data
        });
        return response.data;
      } catch (error) {
        console.error('Search error:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          config: {
            url: error.config?.url,
            params: error.config?.params,
            headers: error.config?.headers
          }
        });
        throw error;
      }
    },
    enabled: !!submittedQuery
  });

  // Genre search query
  const { data: genreResults, isLoading: isGenreLoading, error: genreError } = useQuery({
    queryKey: ['genre', selectedGenre],
    queryFn: async () => {
      if (!selectedGenre) return null;
      
      console.log('Making genre request:', { genre: selectedGenre });
      
      try {
        const response = await axios.get(`${API_BASE_URL}/api/movies/discover`, {
          params: {
            genre: selectedGenre
          }
        });
        console.log('Genre response:', response.data);
        return response.data;
      } catch (error) {
        console.error('Genre search error:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        throw error;
      }
    },
    enabled: !!selectedGenre
  });

  // Default popular movies query
  const { data: popularMovies, isLoading: isPopularLoading, error: popularError } = useQuery({
    queryKey: ['popular'],
    queryFn: async () => {
      console.log('Fetching popular movies');
      try {
        const response = await axios.get(`${API_BASE_URL}/api/movies/discover`);
        console.log('Popular movies response:', response.data);
        return response.data;
      } catch (error) {
        console.error('Popular movies error:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        throw error;
      }
    },
    enabled: !submittedQuery && !selectedGenre
  });

  const isLoading = isSearchLoading || isGenreLoading || isPopularLoading;
  const error = searchError || genreError || popularError;
  const movies = searchResults?.results || genreResults?.results || popularMovies?.results || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-[#f9d3b4] mb-8">Film Alley</h1>
        
        {/* Search Section */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex gap-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="flex-1 px-6 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f9d3b4]"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 rounded-lg bg-[#f9d3b4] text-gray-900 font-semibold hover:bg-[#f0c4a3] transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Browse by Genre</h2>
          <div className="flex flex-wrap gap-2">
            {['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi'].map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreSelect(genre)}
                className={`px-4 py-2 rounded ${
                  selectedGenre === genre
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center py-4">
            {error.response?.data?.message || error.message || 'An error occurred'}
          </div>
        )}

        {!isLoading && !error && movies.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {submittedQuery
              ? 'No movies found matching your search.'
              : 'Select a genre or search for movies to get started.'}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home; 