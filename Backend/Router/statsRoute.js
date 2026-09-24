const express = require('express');
const router = express.Router();
const { getPlatformStats } = require('../Controllers/statsController');

router.get('/summary', getPlatformStats);

module.exports = router;
