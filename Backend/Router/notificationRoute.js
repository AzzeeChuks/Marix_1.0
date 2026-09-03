const express = require('express');
const router = express.Router();
const {
  getUserNotifications,
  markNotificationsAsRead,
} = require('../Controllers/notificationController.js');
const { protect } = require('../Middlewears/auth.js');

// All notification routes require an authenticated session
router.get('/', protect, getUserNotifications);
router.put('/mark-read', protect, markNotificationsAsRead);

module.exports = router;