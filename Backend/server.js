const express = require('express');
const cors = require('cors');
const path = require('path');
const notificationRoutes = require('./Router/notificationRoute');
const productRoutes = require('./Router/productRoutes');
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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/notifications', notificationRoutes);
app.get('/api/auth/dashboard', protect, (req, res) => {
  res.json({ message: `Access granted! User ID: ${req.user}` });
});

// 2. Serve Static Frontend Build Assets
app.use(express.static(path.join(__dirname, '../dist')));

// 3. SPA Fallback: Serve index.html for any unhandled routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));