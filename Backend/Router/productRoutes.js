const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getCampusRecommendations,
  getSearchRecommendations,
  createProduct,
  trackView,
  trackWhatsapp,
} = require('../Controllers/productController');
const { protect } = require('../Middlewears/auth');

// Public catalog route
router.get('/', getProducts);

// Search recommendations
router.get('/search-recommendations', getSearchRecommendations);

// Create product (Protected)
router.post('/', protect, createProduct);

// Interaction Trackers
router.post('/:id/track-view', trackView);
router.post('/:id/track-whatsapp', trackWhatsapp);

// Dynamic ID routes
router.get('/:id', getProductById);
router.get('/:id/recommendations', getCampusRecommendations);

module.exports = router;