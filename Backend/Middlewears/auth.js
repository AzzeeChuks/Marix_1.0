const jwt = require('jsonwebtoken');
const User = require('../Models/User');

// 1. Verify User Session Token & attach user profile
const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization Header (Bearer Token style)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the full user record (excluding sensitive fields) to req.user
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// 2. Spec Requirement: Block Unverified Users from Write Operations
const requireVerified = (req, res, next) => {
  if (!req.user || !req.user.isVerified) {
    return res.status(403).json({ 
      message: 'Email verification required to perform this action.' 
    });
  }
  next();
};

module.exports = { protect, requireVerified };