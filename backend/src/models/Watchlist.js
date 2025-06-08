const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movies: [{
    tmdbId: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    posterPath: String,
    releaseDate: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Ensure a user can only have one watchlist
watchlistSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', watchlistSchema); 