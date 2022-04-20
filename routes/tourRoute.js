const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/').post(tourController.createTour);
router.route('/').get(authController.protect, tourController.getAllTours);
router.route('/:id').get(tourController.getTour).put(tourController.updateTour).delete(tourController.deleteTour);

module.exports = router;
