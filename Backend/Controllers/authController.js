const User = require('../Models/User');
const crypto = require('crypto');
const generateToken = require('../Utilities/Utility');
const sendEmail = require('../Utilities/sendEmail');

// @desc    Register a new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user (password gets hashed automatically via mongoose hook)
    const user = await User.create({ fullName, email, password });

    try {
      await sendEmail({
        email: user.email,
        subject: 'Welcome to Marix Store!',
        message: `Welcome to Marix Store, ${user.fullName}!`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #253238;">
            <h2 style="color: #1f6f78;">Welcome to Marix Store, ${user.fullName}!</h2>
            <p>Thank you for creating your account with us.</p>
            <p>We are glad to have you here. You can now explore listings and connect with the Marix community.</p>
            <p style="margin-top: 24px;">The Marix Store Team</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('Welcome email failed to send:', emailErr.message);
    }

    res.status(201).json({
      message: 'User registered successfully',
      token: generateToken(user._id),
      user
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      message: 'Login successful',
      token: generateToken(user._id),
      user
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Forgot Password - Send Reset Link
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: 'No user found with that email.' });

    // Generate a reset token and persist the hashed token on the model
    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send it via email
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH or POST request with your new password to:\n\n${resetUrl}\n\nIf you didn't forget your password, please ignore this email!`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 1 hour)',
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
    return next(error);
  }
};

// @desc    Reset Password using token
exports.resetPassword = async (req, res, next) => {
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

    // 5. Send back a success response
    res.status(200).json({ message: 'Password reset successful! You can now log in.' });

  } catch (error) {
    return next(error);
  }
};

// @desc    Get Current User Profile (Session Restoration for App.jsx)
// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    // req.user is populated by the 'protect' middleware
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    return next(error);
  }
};