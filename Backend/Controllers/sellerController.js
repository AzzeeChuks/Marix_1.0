const Product = require('../Models/Product');
const Order = require('../Models/Order');

// @desc    Get seller dashboard analytics
// @route   GET /api/seller/analytics
// @access  Private (Merchant/Seller)
exports.getSellerAnalytics = async (req, res, next) => {
  try {
    const sellerId = req.user._id;

    // Count total products listed by this seller
    const totalProducts = await Product.countDocuments({ seller: sellerId });

    // Fetch orders containing products from this seller
    const orders = await Order.find({ 'orderItems.seller': sellerId });

    const totalOrders = orders.length;

    // Calculate revenue for this seller's products only
    const totalRevenue = orders.reduce((acc, order) => {
      const sellerItems = order.orderItems.filter(
        (item) => item.seller.toString() === sellerId.toString()
      );
      const sellerItemTotal = sellerItems.reduce(
        (itemAcc, item) => itemAcc + (item.price * (item.quantity || 1)),
        0
      );
      return acc + sellerItemTotal;
    }, 0);

    res.status(200).json({
      success: true,
      analytics: {
        totalProducts,
        totalOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    return next(error);
  }
};