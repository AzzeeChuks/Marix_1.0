const express = require('express');
const {
  createUserNotification,
  broadcastNotification,
} = require('../Controllers/notificationController');
const { protect, requireAdmin } = require('../Middlewears/auth');

const router = express.Router();

router.use(protect, requireAdmin);
router.post('/user-notification', createUserNotification);
router.post('/broadcast-notification', broadcastNotification);

module.exports = router;