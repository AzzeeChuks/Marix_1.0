const RecentSearch = require('../Models/RecentSearch');

// @desc    Record a user's recent search term
// @route   POST /api/searches/recent
// @access  Private
exports.saveRecentSearch = async (req, res, next) => {
  try {
    const { searchTerm } = req.body;

    if (!searchTerm || !searchTerm.trim()) {
      return res.status(400).json({ message: 'Search term is required' });
    }

    const term = searchTerm.trim().toLowerCase();

    const recentSearch = await RecentSearch.findOneAndUpdate(
      { user: req.user._id, searchTerm: term },
      { $set: { user: req.user._id, searchTerm: term } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      data: recentSearch,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Get a user's recent unique search terms
// @route   GET /api/searches/recent
// @access  Private
exports.getRecentSearches = async (req, res, next) => {
  try {
    const recent = await RecentSearch.find({ user: req.user._id })
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(5)
      .select('searchTerm updatedAt');

    res.status(200).json({
      success: true,
      count: recent.length,
      data: recent,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Get popular platform-wide searches over the last 30 days
// @route   GET /api/searches/popular
// @access  Public
exports.getPopularSearches = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const popular = await RecentSearch.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: '$searchTerm',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1, _id: 1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.status(200).json({
      success: true,
      data: popular,
    });
  } catch (error) {
    return next(error);
  }
};
