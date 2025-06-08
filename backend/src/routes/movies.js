const express = require('express');
const router = express.Router();
const axios = require('axios');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_READ_ACCESS_TOKEN = process.env.TMDB_READ_ACCESS_TOKEN;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Map of genre names to their TMDB IDs
const genreMap = {
  'action': 28,
  'adventure': 12,
  'animation': 16,
  'comedy': 35,
  'crime': 80,
  'documentary': 99,
  'drama': 18,
  'family': 10751,
  'fantasy': 14,
  'history': 36,
  'horror': 27,
  'music': 10402,
  'mystery': 9648,
  'romance': 10749,
  'science fiction': 878,
  'tv movie': 10770,
  'thriller': 53,
  'war': 10752,
  'western': 37
};

// Get popular movies
router.get('/popular', async (req, res) => {
  try {
    if (!TMDB_API_KEY) {
      console.error('TMDB_API_KEY is not defined in environment variables');
      return res.status(500).json({ message: 'TMDB API key is not configured' });
    }

    const { page = 1 } = req.query;
    console.log('Fetching popular movies with page:', page);
    
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching popular movies:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    res.status(500).json({ 
      message: 'Error fetching popular movies',
      details: error.message
    });
  }
});

// Get discover movies
router.get('/discover', async (req, res) => {
  try {
    const TMDB_READ_ACCESS_TOKEN = process.env.TMDB_READ_ACCESS_TOKEN;
    if (!TMDB_READ_ACCESS_TOKEN) {
      console.error('TMDB_READ_ACCESS_TOKEN is not defined');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const { genre, page = 1 } = req.query;
    console.log('Received discover request with params:', { genre, page });

    // Construct the TMDB API request URL
    const url = 'https://api.themoviedb.org/3/discover/movie';
    
    // Build the request parameters
    const params = {
      include_adult: 'false',
      include_video: 'false',
      language: 'en-US',
      page,
      sort_by: 'popularity.desc'
    };

    // If genre is provided, add it to the parameters
    if (genre) {
      // Convert genre name to ID if it's a string
      const genreId = typeof genre === 'string' ? genreMap[genre.toLowerCase()] : genre;
      if (!genreId) {
        console.error('Invalid genre:', genre);
        return res.status(400).json({ message: 'Invalid genre' });
      }
      params.with_genres = genreId;
    }

    // Create the options object exactly as shown in the TMDB API documentation
    const options = {
      method: 'GET',
      url,
      params,
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_READ_ACCESS_TOKEN}`
      }
    };

    console.log('Making TMDB API request with options:', {
      url: options.url,
      params: options.params,
      headers: { ...options.headers, Authorization: 'Bearer [REDACTED]' }
    });

    const response = await axios.request(options);
    console.log('TMDB API response status:', response.status);
    return res.json(response.data);
  } catch (error) {
    console.error('Error in discover endpoint:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Error fetching movies'
    });
  }
});

// Search movies endpoint
router.get('/search', async (req, res) => {
  try {
    const { query, type = 'movie', page = 1 } = req.query;
    console.log('Search request params:', { query, type, page });

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // For movie search, use the read access token
    if (type === 'movie') {
      if (!TMDB_READ_ACCESS_TOKEN) {
        console.error('TMDB_READ_ACCESS_TOKEN is not defined');
        return res.status(500).json({ message: 'Server configuration error' });
      }

      const options = {
        method: 'GET',
        url: `${TMDB_BASE_URL}/search/movie`,
        params: {
          query,
          page,
          language: 'en-US',
          include_adult: 'false'
        },
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${TMDB_READ_ACCESS_TOKEN}`
        }
      };

      console.log('Making TMDB request:', {
        url: options.url,
        params: options.params,
        headers: { ...options.headers, Authorization: '[REDACTED]' }
      });

      try {
        const response = await axios.request(options);
        console.log('TMDB response:', {
          status: response.status,
          statusText: response.statusText,
          resultsCount: response.data?.results?.length
        });
        return res.json(response.data);
      } catch (tmdbError) {
        console.error('TMDB API Error:', {
          message: tmdbError.message,
          response: tmdbError.response?.data,
          status: tmdbError.response?.status,
          config: {
            url: tmdbError.config?.url,
            params: tmdbError.config?.params,
            headers: { ...tmdbError.config?.headers, Authorization: '[REDACTED]' }
          }
        });
        throw tmdbError;
      }
    }

    return res.status(400).json({ message: 'Invalid search type' });
  } catch (error) {
    console.error('Error in search endpoint:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      stack: error.stack
    });
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Error searching movies',
      details: error.message
    });
  }
});

// Get movie details
router.get('/:id', async (req, res) => {
  try {
    if (!TMDB_API_KEY) {
      console.error('TMDB_API_KEY is not defined in environment variables');
      return res.status(500).json({ message: 'TMDB API key is not configured' });
    }

    const { id } = req.params;
    console.log('Fetching movie details for ID:', id);
    
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,similar`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching movie details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    res.status(500).json({ 
      message: 'Error fetching movie details',
      details: error.message
    });
  }
});

module.exports = router; 