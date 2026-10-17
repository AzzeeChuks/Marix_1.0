const express = require('express');
const router = express.Router();
const { getSellerAnalytics, onboardSeller } = require('../Controllers/sellerController');
const { protect } = require('../Middlewears/auth');

router.post('/onboard', protect, onboardSeller);
router.get('/analytics', protect, getSellerAnalytics);

module.exports = router;