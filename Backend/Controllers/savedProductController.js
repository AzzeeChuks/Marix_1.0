const SavedProduct = require('../Models/SavedProduct');
const Product = require('../Models/Product');

// @desc    Save/bookmark a product
// @route   POST /api/saved-products
// @access  Private
exports.saveProduct = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const saved = await SavedProduct.create({
      user: req.user._id,
      product: productId,
    });

    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Product already saved' });
    }
    return next(error);
  }
};

// @desc    Unsave/remove a bookmarked product
// @route   DELETE /api/saved-products/:productId
// @access  Private
exports.unsaveProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const result = await SavedProduct.findOneAndDelete({
      user: req.user._id,
      product: productId,
    });

    if (!result) {
      return res.status(404).json({ message: 'Saved item not found' });
    }

    res.status(200).json({ success: true, message: 'Product removed from saved items' });
  } catch (error) {
    return next(error);
  }
};

// @desc    Get user's saved products
// @route   GET /api/saved-products
// @access  Private
exports.getSavedProducts = async (req, res, next) => {
  try {
    const savedItems = await SavedProduct.find({ user: req.user._id })
      .populate('product')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: savedItems.length,
      data: savedItems,
    });
  } catch (error) {
    return next(error);
  }
};
