const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.route('/profile').get(userController.getMe, userController.getUser);
router.route('/edit-profile').put(userController.updateMe);
router.route('/delete-profile').delete(userController.deleteMe);

router.use(authController.restrictTo('admin'));

// restricted routes
router.route('/').get(userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
