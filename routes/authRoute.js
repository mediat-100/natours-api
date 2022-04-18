const express = require('express');
const auth = require('../controllers/authController')

const router = express.Router();

router.route('/sign-up').post(auth.signup);
router.route('/login').post(auth.login);

module.exports = router;