const Notification = require('../Models/Notification');
const User = require('../Models/User');

// @desc    Get logged-in user notifications
// @route   GET /api/notifications
// @access  Private
exports.getUserNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Mark unread notifications as read
// @route   PUT /api/notifications/mark-read
// @access  Private
exports.markNotificationsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    return next(error);
  }
};

exports.deleteUserNotification = async (req, res, next) => {
  try {
    const deleted = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    return res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    return next(error);
  }
};

exports.createUserNotification = async (req, res, next) => {
  try {
    const { userId, title, message, actionUrl = null } = req.body;
    if (!userId || !title?.trim() || !message?.trim()) {
      return res.status(400).json({ message: 'userId, title, and message are required' });
    }

    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const notification = await Notification.create({
      user: userId,
      title: title.trim(),
      message: message.trim(),
      actionUrl,
    });

    return res.status(201).json({ success: true, data: notification });
  } catch (error) {
    return next(error);
  }
};

exports.broadcastNotification = async (req, res, next) => {
  try {
    const { targetCampus, title, message, actionUrl = null } = req.body;
    if (!targetCampus?.trim() || !title?.trim() || !message?.trim()) {
      return res.status(400).json({ message: 'targetCampus, title, and message are required' });
    }

    const userFilter = targetCampus.trim().toLowerCase() === 'all'
      ? {}
      : { campusLocation: targetCampus.trim() };
    const users = await User.find(userFilter).select('_id').lean();
    if (users.length === 0) {
      return res.status(200).json({ success: true, count: 0, message: 'No matching users found' });
    }

    const notifications = await Notification.insertMany(users.map((user) => ({
      user: user._id,
      title: title.trim(),
      message: message.trim(),
      actionUrl,
    })));

    return res.status(201).json({ success: true, count: notifications.length });
  } catch (error) {
    return next(error);
  }
};