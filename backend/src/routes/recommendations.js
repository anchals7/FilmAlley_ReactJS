const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const Favorite = require('../models/Favorite');
const Review = require('../models/Review');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Get personalized movie recommendations
router.get('/', auth, async (req, res) => {
  try {
    if (!TMDB_API_KEY) {
      console.error('TMDB_API_KEY is not defined in environment variables');
      return res.status(500).json({ message: 'TMDB API key is not configured' });
    }

    // Get user's favorite movies
    const favorites = await Favorite.findOne({ user: req.user.id });
    if (!favorites || !favorites.movies.length) {
      // If no favorites, return popular movies
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=1`
      );
      return res.json(response.data);
    }

    // Get user's reviews for their favorite movies
    const reviews = await Review.find({
      user: req.user.id,
      tmdbId: { $in: favorites.movies.map(m => m.tmdbId) }
    });

    // Create a map of movie ratings (user rating or TMDB rating)
    const movieRatings = new Map();
    
    // Process each favorite movie
    for (const movie of favorites.movies) {
      const userReview = reviews.find(r => r.tmdbId === movie.tmdbId);
      if (userReview) {
        // Use user's rating if available
        movieRatings.set(movie.tmdbId, userReview.rating);
      } else {
        // Get TMDB rating as fallback
        try {
          const tmdbResponse = await axios.get(
            `${TMDB_BASE_URL}/movie/${movie.tmdbId}?api_key=${TMDB_API_KEY}`
          );
          movieRatings.set(movie.tmdbId, tmdbResponse.data.vote_average);
        } catch (error) {
          console.error(`Error fetching TMDB rating for movie ${movie.tmdbId}:`, error);
          // Use a default rating if TMDB API fails
          movieRatings.set(movie.tmdbId, 5.0);
        }
      }
    }

    // Get similar movies for each favorite, weighted by rating
    const similarMovies = new Map();
    for (const movie of favorites.movies) {
      const rating = movieRatings.get(movie.tmdbId);
      try {
        const response = await axios.get(
          `${TMDB_BASE_URL}/movie/${movie.tmdbId}/similar?api_key=${TMDB_API_KEY}&page=1`
        );
        
        // Add each similar movie to our map, weighted by the original movie's rating
        for (const similarMovie of response.data.results) {
          const currentWeight = similarMovies.get(similarMovie.id) || 0;
          similarMovies.set(
            similarMovie.id,
            currentWeight + (rating * similarMovie.vote_average)
          );
        }
      } catch (error) {
        console.error(`Error fetching similar movies for ${movie.tmdbId}:`, error);
      }
    }

    // Convert the map to an array and sort by weight
    const recommendations = Array.from(similarMovies.entries())
      .map(([id, weight]) => ({ id, weight }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 20); // Get top 20 recommendations

    // Get full movie details for each recommendation
    const recommendedMovies = await Promise.all(
      recommendations.map(async ({ id }) => {
        try {
          const response = await axios.get(
            `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`
          );
          return response.data;
        } catch (error) {
          console.error(`Error fetching details for movie ${id}:`, error);
          return null;
        }
      })
    );

    // Filter out any null results and return
    res.json({
      results: recommendedMovies.filter(movie => movie !== null)
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({
      message: 'Error generating recommendations',
      details: error.message
    });
  }
});

module.exports = router; 