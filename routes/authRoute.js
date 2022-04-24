const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/sign-up').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/forgot-password').post(authController.forgotPassword);
router.route('/reset-password/:token').post(authController.resetPassword);
router.route('/update-password').post(authController.protect, authController.updatePassword);

module.exports = router;