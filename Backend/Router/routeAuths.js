const express = require('express');
const authController = require('../Controllers/authController');
const { protect } = require('../Middlewears/auth');

const router = express.Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.post('/register-verification-link', authController.registerVerificationLink);
router.patch('/verify-email/:token', authController.verifyEmail);
router.get('/verify-email/:token', authController.verifyEmail);
router.get('/google', authController.googleOAuth);
router.get('/google/callback', authController.googleOAuthCallback);
router.get('/me', protect, authController.getMe);

module.exports = router;