const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRoute');

const router = express.Router();

router.route('/').get(tourController.getAllTours);
router.route('/:id').get(tourController.getTour);

// protected routes
router.use(authController.protect);

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/')
  .post(
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .put(
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
