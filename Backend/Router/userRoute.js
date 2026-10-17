const express = require('express');
const { updateCampus } = require('../Controllers/userController');
const { protect } = require('../Middlewears/auth');

const router = express.Router();

router.patch('/campus', protect, updateCampus);

module.exports = router;
