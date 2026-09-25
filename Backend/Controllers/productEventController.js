const ProductEvent = require('../Models/ProductEvent');

// @desc    Log a product interaction event
// @route   POST /api/events
// @access  Public
exports.logProductEvent = async (req, res, next) => {
  try {
    const { productId, eventType, ipAddress: bodyIpAddress } = req.body;
    const forwardedIpAddress = req.headers['x-forwarded-for']
      ?.split(',')[0]
      .trim();
    const ipAddress = bodyIpAddress || forwardedIpAddress || req.ip || req.socket.remoteAddress;

    if (!productId || !eventType) {
      return res.status(400).json({ message: 'productId and eventType are required' });
    }

    const event = await ProductEvent.create({
      product: productId,
      user: req.user ? req.user._id : null,
      eventType,
      ipAddress,
    });

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Get recent product activity for a product
// @route   GET /api/events/:productId
// @access  Public
exports.getProductEvents = async (req, res, next) => {
  try {
    const events = await ProductEvent.find({ product: req.params.productId })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('user', 'fullName email');

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Get trending product activity by event type over recent window
// @route   GET /api/events/trending
// @access  Public
exports.getTrendingEvents = async (req, res, next) => {
  try {
    const { days = 7 } = req.query;
    const windowStart = new Date(Date.now() - Number(days) * 24 * 60 * 60 * 1000);

    const trending = await ProductEvent.aggregate([
      {
        $match: {
          createdAt: { $gte: windowStart },
        },
      },
      {
        $group: {
          _id: '$product',
          totalEvents: { $sum: 1 },
          views: {
            $sum: { $cond: [{ $eq: ['$eventType', 'view'] }, 1, 0] },
          },
          whatsappClicks: {
            $sum: { $cond: [{ $eq: ['$eventType', 'whatsapp_click'] }, 1, 0] },
          },
          saves: {
            $sum: { $cond: [{ $eq: ['$eventType', 'save'] }, 1, 0] },
          },
        },
      },
      {
        $sort: { totalEvents: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.status(200).json({
      success: true,
      data: trending,
    });
  } catch (error) {
    return next(error);
  }
};
