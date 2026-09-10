const express = require('express');
const router = express.Router();
const { getSellerAnalytics } = require('../Controllers/sellerController');
const { protect } = require('../Middlewears/auth');

router.get('/analytics', protect, getSellerAnalytics);

module.exports = router;