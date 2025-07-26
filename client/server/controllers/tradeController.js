const AppError = require('../utils/appError');
const logger = require('../utils/logger');
const firebase = require('../config/firebase');

// Create a new trade between two users
exports.createTrade = async (req, res, next) => {
  try {
    const { recipientId, hours, description } = req.body;
    const requesterId = req.user.uid;

    if (!recipientId || !hours) {
      return next(new AppError('recipientId and hours are required', 400));
    }

    // create trade doc
    const tradeRef = await firebase.db.collection('trades').add({
      participants: [requesterId, recipientId],
      requesterId,
      recipientId,
      hours: Number(hours),
      description: description || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    res.status(201).json({ status: 'success', id: tradeRef.id });
  } catch (error) {
    logger.error('Error creating trade:', error);
    next(error);
  }
};

// Request time credits is same as createTrade (alias)
exports.requestTimeCredits = exports.createTrade;

// Accept or reject a trade request
exports.respondToRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'accept' or 'reject'
    const userId = req.user.uid;

    const tradeRef = firebase.db.collection('trades').doc(id);
    const tradeDoc = await tradeRef.get();

    if (!tradeDoc.exists) return next(new AppError('Trade not found', 404));
    const trade = tradeDoc.data();

    if (trade.recipientId !== userId) return next(new AppError('Not authorized to respond', 403));
    if (trade.status !== 'pending') return next(new AppError('Trade already processed', 400));

    const newStatus = action === 'accept' ? 'accepted' : 'rejected';
    await tradeRef.update({ status: newStatus, updatedAt: new Date().toISOString() });

    res.status(200).json({ status: 'success', newStatus });
  } catch (error) {
    logger.error('Error responding to trade:', error);
    next(error);
  }
};

// Get all trades involving current user, now with user names
exports.getTradeHistory = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const tradesSnapshot = await firebase.db
      .collection('trades')
      .where('participants', 'array-contains', userId)
      .orderBy('createdAt', 'desc')
      .get();

    if (tradesSnapshot.empty) {
      return res.status(200).json({ status: 'success', data: [] });
    }

    const trades = tradesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Get all unique participant IDs from the trades
    const userIds = new Set();
    trades.forEach(trade => {
      userIds.add(trade.requesterId);
      userIds.add(trade.recipientId);
    });

    // Fetch user details for all participants
    const usersRef = firebase.db.collection('users');
    const userDocs = await Promise.all(
      Array.from(userIds).map(id => usersRef.doc(id).get())
    );
    
    const usersMap = new Map();
    userDocs.forEach(doc => {
      if (doc.exists) {
        // Assuming user docs have a 'displayName' field
        usersMap.set(doc.id, doc.data().displayName || 'Unknown User');
      }
    });

    // Add requester and recipient names to each trade
    const tradesWithNames = trades.map(trade => ({
      ...trade,
      requesterName: usersMap.get(trade.requesterId),
      recipientName: usersMap.get(trade.recipientId),
    }));

    res.status(200).json({ status: 'success', data: tradesWithNames });
  } catch (error) {
    logger.error('Error fetching trade history:', error);
    next(error);
  }
};

// Get single trade
exports.getTrade = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tradeDoc = await firebase.db.collection('trades').doc(id).get();
    if (!tradeDoc.exists) return next(new AppError('Trade not found', 404));
    res.status(200).json({ status: 'success', data: { id, ...tradeDoc.data() } });
  } catch (error) {
    logger.error('Error fetching trade:', error);
    next(error);
  }
};

// Cancel a trade by requester before it is accepted
exports.cancelTrade = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const tradeRef = firebase.db.collection('trades').doc(id);
    const tradeDoc = await tradeRef.get();
    if (!tradeDoc.exists) return next(new AppError('Trade not found', 404));
    const trade = tradeDoc.data();

    if (trade.requesterId !== userId) return next(new AppError('Not authorized', 403));
    if (trade.status !== 'pending') return next(new AppError('Only pending trades can be cancelled', 400));

    await tradeRef.update({ status: 'cancelled', updatedAt: new Date().toISOString() });
    res.status(200).json({ status: 'success' });
  } catch (error) {
    logger.error('Error cancelling trade:', error);
    next(error);
  }
};
