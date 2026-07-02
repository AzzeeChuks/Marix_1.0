const User = require('../Models/User');
const crypto = require('crypto');
const generateToken = require('../Utilities/Utility');
const sendEmail = require('../Utilities/sendEmail');
const bcrypt = require('bcryptjs');

// @desc    Register a new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user (password gets hashed automatically via mongoose hook)
    const user = await User.create({ username, email, password });

    res.status(201).json({
      message: 'User registered successfully',
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      message: 'Login successful',
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot Password - Send Reset Link
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: 'No user found with that email.' });

    // Generate a random unhashed token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token and save to database with a 10-minute expiry window
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    // Send it via email
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password to:\n\n${resetUrl}\n\nIf you didn't forget your password, please ignore this email!`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message,
      });
      res.status(200).json({ message: 'Token sent to email!' });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ message: 'There was an error sending the email. Try again later.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset Password using token
exports.resetPassword = async (req, res) => {
  try {
    // 1. Hash the token from the URL parameters to match what is stored in the DB
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // 2. Find the user with this token AND check if the token hasn't expired yet
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() } // $gt means "greater than" current time
    });

    // If token is invalid or has expired, reject the request
    if (!user) {
      return res.status(400).json({ message: 'Token is invalid or has expired.' });
    }

    // 3. Set the new password (your User model pre-save hook will automatically hash this)
    user.password = req.body.password;
    
    // 4. Clear out the reset token fields since they used it successfully
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    // 5. Send back a success response (or automatically sign them in with a JWT)
    res.status(200).json({ message: 'Password reset successful! You can now log in.' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
