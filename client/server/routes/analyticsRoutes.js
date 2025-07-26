const express = require('express');
const router = express.Router();

const analyticsController = require('../controllers/analyticsController');

// Route to get community statistics
router.get('/stats', analyticsController.getCommunityStats);

// Route to get recent community activity
router.get('/activity', analyticsController.getRecentActivity);

module.exports = router;
