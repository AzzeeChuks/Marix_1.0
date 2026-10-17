const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const generateToken = require('../Utilities/Utility');
const sendEmail = require('../Utilities/sendEmail');

const signGoogleOAuthState = (payload) => crypto
  .createHmac('sha256', process.env.JWT_SECRET)
  .update(payload)
  .digest('hex');

// @desc    Register a new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email }).select('_id').lean();
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
    const user = await User.findOne({ email }).select('+password').lean();
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const safeUser = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      isVerified: user.isVerified,
      campusLocation: user.campusLocation,
      isSeller: user.isSeller,
      shopName: user.shopName,
      whatsappNumber: user.whatsappNumber,
      aboutShop: user.aboutShop,
      createdAt: user.createdAt,
    };

    res.status(200).json({
      message: 'Login successful',
      token: generateToken(user._id),
      user: safeUser,
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

exports.registerVerificationLink = async (req, res, next) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No user found with that email.' });
    if (user.isVerified) return res.status(400).json({ message: 'Email is already verified.' });

    const token = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');
    user.emailVerificationExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    const apiBaseUrl = (process.env.API_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
    const verificationUrl = `${apiBaseUrl}/api/auth/verify-email/${token}`;
    try {
      await sendEmail({
        email: user.email,
        subject: 'Verify your Marix Store email',
        message: `Verify your email: ${verificationUrl}`,
        html: `<p>Confirm your email for Marix Store:</p><p><a href="${verificationUrl}">Verify email</a></p><p>This link expires in one hour.</p>`,
      });
    } catch (emailError) {
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(503).json({ message: 'Could not send verification email. Try again later.' });
    }

    return res.status(200).json({ success: true, message: 'Verification link sent.' });
  } catch (error) {
    return next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: 'Verification token is invalid or expired.' });

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json({ success: true, message: 'Email verified successfully.' });
  } catch (error) {
    return next(error);
  }
};

exports.googleOAuth = (req, res) => {
  const { GOOGLE_CLIENT_ID, GOOGLE_CALLBACK_URL } = process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CALLBACK_URL || !process.env.JWT_SECRET) {
    return res.status(503).json({ message: 'Google OAuth is not configured on this server.' });
  }

  const statePayload = `${Date.now()}.${crypto.randomBytes(24).toString('hex')}`;
  const state = `${statePayload}.${signGoogleOAuthState(statePayload)}`;
  const authorizationUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authorizationUrl.search = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_CALLBACK_URL,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
  }).toString();
  return res.redirect(302, authorizationUrl.toString());
};

exports.googleOAuthCallback = async (req, res, next) => {
  try {
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env;
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL || !process.env.JWT_SECRET) {
      return res.status(503).json({ message: 'Google OAuth is not configured on this server.' });
    }
    if (req.query.error || !req.query.code || typeof req.query.state !== 'string') {
      return res.status(400).json({ message: 'Google authorization was not completed.' });
    }

    const stateParts = req.query.state.split('.');
    const providedSignature = Buffer.from(stateParts.pop() || '', 'hex');
    const statePayload = stateParts.join('.');
    const expectedSignature = Buffer.from(signGoogleOAuthState(statePayload), 'hex');
    const stateTimestamp = Number(statePayload.split('.')[0]);
    if (
      providedSignature.length !== expectedSignature.length ||
      !crypto.timingSafeEqual(providedSignature, expectedSignature) ||
      !Number.isFinite(stateTimestamp) ||
      Date.now() - stateTimestamp > 10 * 60 * 1000
    ) {
      return res.status(400).json({ message: 'Google authorization state is invalid or expired.' });
    }

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: String(req.query.code),
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_CALLBACK_URL,
        grant_type: 'authorization_code',
      }),
    });
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      return res.status(401).json({ message: 'Could not exchange Google authorization code.' });
    }

    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const googleUser = await profileResponse.json();
    if (!profileResponse.ok || !googleUser.id || !googleUser.email || !googleUser.verified_email) {
      return res.status(401).json({ message: 'Google did not provide a verified email address.' });
    }

    let user = await User.findOne({ $or: [
      { googleId: googleUser.id },
      { email: googleUser.email.toLowerCase() },
    ] });
    if (user) {
      user.googleId = googleUser.id;
      user.isVerified = true;
      await user.save({ validateBeforeSave: false });
    } else {
      user = await User.create({
        fullName: googleUser.name || googleUser.email.split('@')[0],
        email: googleUser.email.toLowerCase(),
        password: crypto.randomBytes(48).toString('hex'),
        googleId: googleUser.id,
        isVerified: true,
      });
    }

    const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL;
    if (!frontendUrl) return res.status(500).json({ message: 'FRONTEND_URL must be configured.' });
    const authToken = generateToken(user._id);
    return res.redirect(302, `${frontendUrl.replace(/\/$/, '')}/#authToken=${encodeURIComponent(authToken)}`);
  } catch (error) {
    return next(error);
  }
};

// @desc    Get Current User Profile (Session Restoration for App.jsx)
// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const { _id, fullName, email, isVerified, campusLocation, isSeller, isEarlySeller, earlySellerBadgeNumber, shopName, whatsappNumber, aboutShop, createdAt } = req.user;

    res.status(200).json({
      success: true,
      user: {
        _id,
        fullName,
        email,
        isVerified,
        campusLocation,
        isSeller,
        isEarlySeller,
        earlySellerBadgeNumber,
        shopName,
        whatsappNumber,
        aboutShop,
        createdAt,
      },
    });
  } catch (error) {
    return next(error);
  }
};