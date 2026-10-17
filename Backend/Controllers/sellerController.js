const Product = require('../Models/Product');
const User = require('../Models/User');

exports.onboardSeller = async (req, res, next) => {
  try {
    const { shopName, whatsappNumber, aboutShop, campusLocation } = req.body;
    if (![shopName, whatsappNumber, campusLocation].every((value) => typeof value === 'string' && value.trim())) {
      return res.status(400).json({ message: 'shopName, whatsappNumber, and campusLocation are required' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          isSeller: true,
          shopName: shopName.trim(),
          whatsappNumber: whatsappNumber.trim(),
          aboutShop: typeof aboutShop === 'string' ? aboutShop.trim() : '',
          campusLocation: campusLocation.trim(),
        },
      },
      { new: true, runValidators: true }
    ).select('_id fullName email campusLocation isSeller isEarlySeller earlySellerBadgeNumber shopName whatsappNumber aboutShop');

    const countSellers = await User.countDocuments({ isSeller: true });
    const isEarlySeller = countSellers <= 50;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { isEarlySeller, earlySellerBadgeNumber: isEarlySeller ? countSellers : null } },
      { new: true }
    ).select('_id fullName email campusLocation isSeller isEarlySeller earlySellerBadgeNumber shopName whatsappNumber aboutShop');

    return res.status(200).json({ success: true, user: updatedUser || user });
  } catch (error) {
    return next(error);
  }
};

// @desc    Get seller dashboard analytics
// @route   GET /api/seller/analytics
// @access  Private (Merchant/Seller)
exports.getSellerAnalytics = async (req, res, next) => {
  try {
    const sellerId = req.user._id;
    const products = await Product.find({ sellerId })
      .select('_id productTitle status viewCount whatsappClicks images price campus')
      .lean();
    const activeListingsCount = products.filter((product) => product.status === 'active').length;
    const totalViews = products.reduce((total, product) => total + (product.viewCount || 0), 0);
    const totalWhatsAppClicks = products.reduce((total, product) => total + (product.whatsappClicks || 0), 0);
    const rankedProducts = [...products].sort((first, second) => (second.viewCount || 0) - (first.viewCount || 0));
    const toSummary = (product) => product ? {
      id: product._id,
      title: product.productTitle,
      views: product.viewCount || 0,
      whatsappClicks: product.whatsappClicks || 0,
      images: product.images,
      price: product.price,
      campus: product.campus,
    } : null;

    res.status(200).json({
      success: true,
      activeListingsCount,
      totalViews,
      totalWhatsAppClicks,
      topProduct: toSummary(rankedProducts[0]),
      lowestProduct: toSummary(rankedProducts.at(-1)),
    });
  } catch (error) {
    return next(error);
  }
};