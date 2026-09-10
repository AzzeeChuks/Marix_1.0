const Product = require('../Models/Product');

// @desc    Get seller analytics dashboard payload
// @route   GET /api/seller/analytics
// @access  Private (Merchant/Seller)
exports.getSellerAnalytics = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // Fetch all active listings for the seller
    const sellerProducts = await Product.find({
      sellerId,
      status: 'active',
    }).select('productTitle viewCount whatsappClicks status');

    const activeListingsCount = sellerProducts.length;

    // Calculate totals
    const totalProductViews = sellerProducts.reduce((acc, item) => acc + item.viewCount, 0);
    const totalWhatsappClicks = sellerProducts.reduce((acc, item) => acc + item.whatsappClicks, 0);

    // Identify highest and lowest viewed products
    let highestViewedProduct = null;
    let lowestViewedProduct = null;

    if (sellerProducts.length > 0) {
      const sortedByViews = [...sellerProducts].sort((a, b) => b.viewCount - a.viewCount);

      const topProduct = sortedByViews[0];
      highestViewedProduct = {
        id: topProduct._id,
        title: topProduct.productTitle,
        views: topProduct.viewCount,
      };

      const bottomProduct = sortedByViews[sortedByViews.length - 1];
      lowestViewedProduct = {
        id: bottomProduct._id,
        title: bottomProduct.productTitle,
        views: bottomProduct.viewCount,
      };
    }

    res.status(200).json({
      success: true,
      activeListingsCount,
      totalProductViews,
      totalWhatsappClicks,
      highestViewedProduct,
      lowestViewedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
