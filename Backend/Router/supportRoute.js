const express = require('express');
const router = express.Router();
const { createIssueReport } = require('../Controllers/supportController');
const { protect } = require('../Middlewears/auth');

router.post('/report', protect, createIssueReport);

module.exports = router;
