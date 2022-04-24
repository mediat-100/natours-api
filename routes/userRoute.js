const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/edit-user').put(authController.protect, userController.updateUser);
router.route('/delete-me').put(authController.protect, userController.deleteUser);

module.exports = router;