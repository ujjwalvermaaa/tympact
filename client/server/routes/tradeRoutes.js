const express = require('express');
const tradeController = require('../controllers/tradeController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes with authentication
router.use(authenticate);

// Create a new trade (send time credits to another user)
router.post('/', tradeController.createTrade);

// Request time credits from another user
router.post('/request', tradeController.requestTimeCredits);

// Respond to a time credit request
router.patch('/:id/respond', tradeController.respondToRequest);

// Get trade history
router.get('/history', tradeController.getTradeHistory);

// Get trade details
router.get('/:id', tradeController.getTrade);

// Cancel a pending trade
router.delete('/:id', tradeController.cancelTrade);

module.exports = router;
