const express = require('express');
const router = express.Router();
const {
  logProductEvent,
  getProductEvents,
  getTrendingEvents,
} = require('../Controllers/productEventController');

router.post('/', logProductEvent);
router.get('/trending', getTrendingEvents);
router.get('/:productId', getProductEvents);

module.exports = router;
