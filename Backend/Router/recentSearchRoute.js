const express = require('express');
const router = express.Router();
const {
  saveRecentSearch,
  getRecentSearches,
  getPopularSearches,
} = require('../Controllers/recentSearchController');
const { protect } = require('../Middlewears/auth');

router.post('/recent', protect, saveRecentSearch);
router.get('/recent', protect, getRecentSearches);
router.get('/popular', getPopularSearches);

module.exports = router;
