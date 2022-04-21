const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/').post(authController.protect, tourController.createTour);
router.route('/').get(authController.protect, authController.restrictTo('admin'), tourController.getAllTours);
router.route('/:id').get(tourController.getTour).put(authController.protect, tourController.updateTour).delete(authController.protect, tourController.deleteTour);

module.exports = router;
