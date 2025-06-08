const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Watchlist = require('../models/Watchlist');

// Get user's watchlist
router.get('/', auth, async (req, res) => {
  try {
    let watchlist = await Watchlist.findOne({ user: req.user._id });
    
    if (!watchlist) {
      watchlist = new Watchlist({ user: req.user._id, movies: [] });
      await watchlist.save();
    }
    
    res.json(watchlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add movie to watchlist
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

    let watchlist = await Watchlist.findOne({ user: req.user._id });
    
    if (!watchlist) {
      watchlist = new Watchlist({ user: req.user._id, movies: [] });
    }

    // Check if movie is already in watchlist
    const movieExists = watchlist.movies.some(movie => movie.tmdbId === tmdbId);
    if (movieExists) {
      return res.status(400).json({ message: 'Movie already in watchlist' });
    }

    // Add movie to watchlist
    watchlist.movies.push({
      tmdbId,
      title,
      posterPath,
      releaseDate,
      addedAt: new Date()
    });

    await watchlist.save();
    res.json(watchlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove movie from watchlist
router.delete('/remove/:tmdbId', auth, async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({ user: req.user._id });
    
    if (!watchlist) {
      return res.status(404).json({ message: 'Watchlist not found' });
    }

    watchlist.movies = watchlist.movies.filter(
      movie => movie.tmdbId !== parseInt(req.params.tmdbId)
    );

    await watchlist.save();
    res.json(watchlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 