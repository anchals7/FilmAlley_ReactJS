const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Favorite = require('../models/Favorite');

// Get user's favorites
router.get('/', auth, async (req, res) => {
  try {
    let favorites = await Favorite.findOne({ user: req.user._id });
    
    if (!favorites) {
      favorites = new Favorite({ user: req.user._id, movies: [] });
      await favorites.save();
    }
    
    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add movie to favorites
router.post('/add', auth, [
  body('tmdbId').isNumeric().withMessage('Invalid movie ID'),
  body('title').notEmpty().withMessage('Title is required'),
  body('posterPath').optional(),
  body('releaseDate').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { tmdbId, title, posterPath, releaseDate } = req.body;

    let favorites = await Favorite.findOne({ user: req.user._id });
    
    if (!favorites) {
      favorites = new Favorite({ user: req.user._id, movies: [] });
    }

    // Check if movie is already in favorites
    const movieExists = favorites.movies.some(movie => movie.tmdbId === tmdbId);
    if (movieExists) {
      return res.status(400).json({ message: 'Movie already in favorites' });
    }

    // Add movie to favorites
    favorites.movies.push({
      tmdbId,
      title,
      posterPath,
      releaseDate,
      addedAt: new Date()
    });

    await favorites.save();
    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove movie from favorites
router.delete('/remove/:tmdbId', auth, async (req, res) => {
  try {
    const favorites = await Favorite.findOne({ user: req.user._id });
    
    if (!favorites) {
      return res.status(404).json({ message: 'Favorites not found' });
    }

    favorites.movies = favorites.movies.filter(
      movie => movie.tmdbId !== parseInt(req.params.tmdbId)
    );

    await favorites.save();
    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 