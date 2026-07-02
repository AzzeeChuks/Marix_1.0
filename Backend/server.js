const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import Database Connection
const connectDB = require('./utils/db');

// Import Controllers / Middleware
const authController = require('./controllers/authController');
const protect = require('./middleware/authMiddleware');

const app = express();

// Connect to MongoDB
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/auth/register', authController.registerUser);
app.post('/api/auth/login', authController.loginUser);
app.get('/api/auth/dashboard', protect, (req, res) => {
  res.json({ message: `Access granted! User ID: ${req.user}` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));