const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Update user profile
router.put('/profile', auth, [
  body('firstName').optional().trim(),
  body('lastName').optional().trim(),
  body('email').optional().isEmail().withMessage('Please enter a valid email'),
  body('username').optional().trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
], async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, username } = req.body;

    // Check if email or username is already taken
    if (email || username) {
      const existingUser = await User.findOne({
        $or: [
          { email: email || '' },
          { username: username || '' }
        ],
        _id: { $ne: req.user._id }
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Email or username already taken' });
      }
    }

    // Update user
    const user = await User.findById(req.user._id);
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (username) user.username = username;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user preferences
router.put('/preferences', auth, [
  body('favoriteGenres').optional().isArray(),
  body('preferredDecades').optional().isArray(),
  body('preferredRatings').optional().isArray()
], async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { favoriteGenres, preferredDecades, preferredRatings } = req.body;

    // Update preferences
    const user = await User.findById(req.user._id);
    if (favoriteGenres) user.preferences.favoriteGenres = favoriteGenres;
    if (preferredDecades) user.preferences.preferredDecades = preferredDecades;
    if (preferredRatings) user.preferences.preferredRatings = preferredRatings;

    await user.save();

    res.json({
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 