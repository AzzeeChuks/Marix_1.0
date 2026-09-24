const express = require('express');
const router = express.Router();
const {
  getUserNotifications,
  markNotificationsRead,
} = require('../Controllers/notificationController');
const { protect } = require('../Middlewears/auth');

router.use(protect); // All notification routes require authentication

router.get('/', getUserNotifications);
router.put('/mark-read', markNotificationsRead);

module.exports = router;