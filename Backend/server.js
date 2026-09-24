const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const notificationRoutes = require('./Router/notificationRoute');
const productRoutes = require('./Router/productRoutes');
const savedProductRoutes = require('./Router/savedProductRoute');
const recentSearchRoutes = require('./Router/recentSearchRoute');
const statsRoutes = require('./Router/statsRoute');
const productEventRoutes = require('./Router/productEventRoute');
require('dotenv').config();

// Import Database Connection
const connectDB = require('./Utilities/db');

// Import Controllers / Middleware
const { protect, requireVerified } = require('./Middlewears/auth');
const authRoutes = require('./Router/routeAuths');

const app = express();

// Connect to MongoDB
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());

// Express middleware for serving uploaded static files
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/saved-products', savedProductRoutes);
app.use('/api/searches', recentSearchRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/events', productEventRoutes);
app.use('/api/upload', require('./Router/uploadRoutes'));
app.use('/api/support', require('./Router/supportRoute'));
app.use('/api/seller', require('./Router/sellerRoute'));

// Auth Dashboard Test Route
app.get('/api/auth/dashboard', protect, (req, res, next) => {
  res.json({ message: `Access granted! User ID: ${req.user._id}` });
});

// Session Logout Route
app.post('/api/auth/logout', (req, res, next) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// Temporary programmatic index drop
mongoose.connection.once('open', async () => {
  try {
    await mongoose.connection.collection('users').dropIndex('username_1');
    console.log('Successfully dropped stale username_1 index!');
  } catch (err) {
    if (err.code === 27 || err.message.includes('index not found')) {
      console.log('username_1 index already removed or does not exist.');
    } else {
      console.error('Error dropping index:', err.message);
    }
  }
});

// 2. Serve Static Frontend Build Assets
app.use(express.static(path.join(__dirname, '../dist')));

// 3. SPA Fallback: Serve index.html for any unhandled routes
app.get('*', (req, res, next) => {
  res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));