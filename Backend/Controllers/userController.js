const User = require('../Models/User');

exports.updateCampus = async (req, res, next) => {
  try {
    const campusLocation = typeof req.body.campusLocation === 'string'
      ? req.body.campusLocation.trim()
      : '';

    if (!campusLocation) {
      return res.status(400).json({ message: 'campusLocation is required' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { campusLocation } },
      { new: true, runValidators: true }
    ).select('_id fullName email campusLocation isSeller shopName whatsappNumber aboutShop');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return next(error);
  }
};
