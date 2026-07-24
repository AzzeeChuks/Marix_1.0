const express = require('express');
const authController = require('../Controllers/authController');
const { protect } = require('../Middlewears/auth');

const router = express.Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.get('/me', protect, authController.getMe);

module.exports = router;