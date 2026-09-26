const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import Database Connection
const connectDB = require('./Utilities/db');

// Import Middleware & Routers
const { protect } = require('./Middlewears/auth');
const authRoutes = require('./Router/routeAuths');
const notificationRoutes = require('./Router/notificationRoute');
const productRoutes = require('./Router/productRoutes');
const savedProductRoutes = require('./Router/savedProductRoute');
const recentSearchRoutes = require('./Router/recentSearchRoute');
const statsRoutes = require('./Router/statsRoute');
const productEventRoutes = require('./Router/productEventRoute');

const app = express();

// Connect to MongoDB
connectDB();

// Global Middlewares
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin is not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.use(express.json());

// 1. Inline Auth Overrides (Placed BEFORE mounted router)
app.get('/api/auth/dashboard', protect, (req, res) => {
  res.json({ message: `Access granted! User ID: ${req.user._id}` });
});

app.post('/api/auth/logout', (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// 2. Mounted API Routers
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

// 3. Static File Uploads Directory
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// 4. API 404 Fallback Guard (Returns JSON for unmatched /api/* routes)
app.all('/api/*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// 5. Frontend Production Static Build & SPA Catch-All
const frontendBuildPath = path.join(__dirname, '../dist');
const frontendIndexPath = path.join(frontendBuildPath, 'index.html');

if (process.env.NODE_ENV === 'production' && fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));

  if (fs.existsSync(frontendIndexPath)) {
    app.get('*', (req, res) => {
      res.sendFile(frontendIndexPath);
    });
  }
}

// 6. Global Error Handler (Must remain last)
app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));