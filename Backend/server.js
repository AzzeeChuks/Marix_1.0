const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import Database Connection
const connectDB = require('./Utilities/db');

// Import Controllers / Middleware
const protect = require('./Middlewears/auth');
const authRoutes = require('./Router/routeAuths');

const app = express();

// Connect to MongoDB
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.get('/api/auth/dashboard', protect, (req, res) => {
  res.json({ message: `Access granted! User ID: ${req.user}` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));