const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Review = require('../models/Review');

// Get reviews for a movie
router.get('/movie/:movieId', async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's review for a movie
router.get('/movie/:movieId/user', auth, async (req, res) => {
  try {
    const review = await Review.findOne({
      movieId: req.params.movieId,
      user: req.user._id
    });
    res.json(review || null);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or update a review
router.post('/movie/:movieId', auth, [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('review')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Review must be between 1 and 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, review } = req.body;
    const movieId = parseInt(req.params.movieId);

    let userReview = await Review.findOne({
      movieId,
      user: req.user._id
    });

    if (userReview) {
      // Update existing review
      userReview.rating = rating;
      userReview.review = review;
      userReview.updatedAt = Date.now();
    } else {
      // Create new review
      userReview = new Review({
        user: req.user._id,
        movieId,
        rating,
        review
      });
    }

    await userReview.save();
    res.json(userReview);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'You have already reviewed this movie' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// Delete a review
router.delete('/movie/:movieId', auth, async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      movieId: req.params.movieId,
      user: req.user._id
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 