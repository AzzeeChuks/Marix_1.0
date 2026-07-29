const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getCampusRecommendations,
  getSearchRecommendations,
  createProduct,
} = require('../Controllers/productController');
const { protect } = require('../Middlewears/auth');

// Public catalog route
router.get('/', getProducts);

// Search recommendations
router.get('/search-recommendations', getSearchRecommendations);

// Create product (Protected)
router.post('/', protect, createProduct);

// Dynamic ID routes
router.get('/:id', getProductById);
router.get('/:id/recommendations', getCampusRecommendations);

module.exports = router;