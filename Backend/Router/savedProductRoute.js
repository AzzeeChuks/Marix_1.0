const express = require('express');
const router = express.Router();
const {
  saveProduct,
  unsaveProduct,
  getSavedProducts,
} = require('../Controllers/savedProductController');
const { protect } = require('../Middlewears/auth');

router.post('/', protect, saveProduct);
router.get('/', protect, getSavedProducts);
router.delete('/:productId', protect, unsaveProduct);

module.exports = router;
