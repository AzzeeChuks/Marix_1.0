const Product = require('../Models/Product');

// @desc    Get dynamic platform summary metrics
// @route   GET /api/stats/summary
// @access  Public
exports.getPlatformStats = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments({ status: 'active' });

    const distinctSellers = await Product.distinct('sellerId', { status: 'active' });
    const totalSellers = distinctSellers.length;

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalSellers,
      },
    });
  } catch (error) {
    return next(error);
  }
};
