const mongoose = require('mongoose');
// const User = require('./userModel');
// const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: true,
  },
  rating: {
    required: true,
    type: Number,
    min: [1, 'ratings must be at least 1'],
    max: [5, 'ratings must be at most 5'],
  },
  user: {
    ref: 'User',
    type: mongoose.Schema.ObjectId,
  },
  tour: {
    ref: 'Tour',
    type: mongoose.Schema.ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// setting index to prevent duplicate reviews
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName',
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
