const express = require('express');
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes with authentication
router.use(authenticate);

// Get all notifications with optional filters
router.get('/', notificationController.getAllNotifications);

// Get unread notification count
router.get('/unread-count', notificationController.getUnreadCount);

// Mark a notification as read
router.patch('/:id/read', notificationController.markAsRead);

// Mark all notifications as read
router.patch('/mark-all-read', notificationController.markAllAsRead);

// Delete a notification
router.delete('/:id', notificationController.deleteNotification);

// Clear all notifications
router.delete('/', notificationController.clearAllNotifications);

module.exports = router;
