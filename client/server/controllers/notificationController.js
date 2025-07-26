const firebase = require('../config/firebase');
const AppError = require('../utils/appError');
const logger = require('../utils/logger');

// Get all notifications for the current user
exports.getAllNotifications = async (req, res, next) => {
  try {
    const { isRead, type, limit = 20, page = 1 } = req.query;
    const userId = req.user.uid;
    
    let query = firebase.db.collection('notifications')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc');
    
    // Apply filters
    if (isRead !== undefined) {
      query = query.where('isRead', '==', isRead === 'true');
    }
    
    if (type) {
      query = query.where('type', '==', type);
    }
    
    // Get total count for pagination
    const snapshot = await query.get();
    const total = snapshot.size;
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    
    // Apply pagination
    const notificationsSnapshot = await query
      .limit(parseInt(limit))
      .offset(skip)
      .get();
    
    const notifications = [];
    notificationsSnapshot.forEach(doc => {
      notifications.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    res.status(200).json({
      status: 'success',
      results: notifications.length,
      total,
      totalPages,
      currentPage: parseInt(page),
      data: {
        notifications,
      },
    });
  } catch (error) {
    logger.error('Error getting notifications:', error);
    next(error);
  }
};

// Get unread notification count
exports.getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    
    const snapshot = await firebase.db.collection('notifications')
      .where('userId', '==', userId)
      .where('isRead', '==', false)
      .get();
      
    const unreadCount = snapshot.size;
    
    res.status(200).json({
      status: 'success',
      data: {
        unreadCount,
      },
    });
  } catch (error) {
    logger.error('Error getting unread notification count:', error);
    next(error);
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;
    
    // Get the notification
    const notificationRef = firebase.db.collection('notifications').doc(id);
    const notificationDoc = await notificationRef.get();
    
    if (!notificationDoc.exists) {
      return next(new AppError('No notification found with that ID', 404));
    }
    
    const notification = notificationDoc.data();
    
    // Check if the notification belongs to the user
    if (notification.userId !== userId) {
      return next(new AppError('You are not authorized to update this notification', 403));
    }
    
    // Update the notification
    await notificationRef.update({
      isRead: true,
      readAt: new Date().toISOString(),
    });
    
    res.status(200).json({
      status: 'success',
      message: 'Notification marked as read',
    });
  } catch (error) {
    logger.error('Error marking notification as read:', error);
    next(error);
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    
    // Get all unread notifications for the user
    const snapshot = await firebase.db.collection('notifications')
      .where('userId', '==', userId)
      .where('isRead', '==', false)
      .get();
    
    // Create a batch to update all notifications
    const batch = firebase.db.batch();
    const now = new Date().toISOString();
    
    snapshot.forEach(doc => {
      const notificationRef = firebase.db.collection('notifications').doc(doc.id);
      batch.update(notificationRef, {
        isRead: true,
        readAt: now,
      });
    });
    
    // Commit the batch
    await batch.commit();
    
    res.status(200).json({
      status: 'success',
      message: `Marked ${snapshot.size} notifications as read`,
    });
  } catch (error) {
    logger.error('Error marking all notifications as read:', error);
    next(error);
  }
};

// Delete a notification
exports.deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;
    
    // Get the notification
    const notificationRef = firebase.db.collection('notifications').doc(id);
    const notificationDoc = await notificationRef.get();
    
    if (!notificationDoc.exists) {
      return next(new AppError('No notification found with that ID', 404));
    }
    
    const notification = notificationDoc.data();
    
    // Check if the notification belongs to the user
    if (notification.userId !== userId) {
      return next(new AppError('You are not authorized to delete this notification', 403));
    }
    
    // Delete the notification
    await notificationRef.delete();
    
    // Remove the notification ID from the user's notifications array
    await firebase.db.collection('users').doc(userId).update({
      notifications: firebase.db.FieldValue.arrayRemove(id),
    });
    
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    logger.error('Error deleting notification:', error);
    next(error);
  }
};

// Clear all notifications
exports.clearAllNotifications = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    
    // Get all notifications for the user
    const snapshot = await firebase.db.collection('notifications')
      .where('userId', '==', userId)
      .get();
    
    // Create a batch to delete all notifications
    const batch = firebase.db.batch();
    const notificationIds = [];
    
    snapshot.forEach(doc => {
      notificationIds.push(doc.id);
      const notificationRef = firebase.db.collection('notifications').doc(doc.id);
      batch.delete(notificationRef);
    });
    
    // Commit the batch
    await batch.commit();
    
    // Clear the notifications array in the user document
    if (notificationIds.length > 0) {
      await firebase.db.collection('users').doc(userId).update({
        notifications: [],
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: `Deleted ${notificationIds.length} notifications`,
    });
  } catch (error) {
    logger.error('Error clearing all notifications:', error);
    next(error);
  }
};

// Get unread notification count
exports.getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    
    // Count unread notifications
    const snapshot = await firebase.db.collection('notifications')
      .where('userId', '==', userId)
      .where('isRead', '==', false)
      .get();
    
    res.status(200).json({
      status: 'success',
      data: {
        count: snapshot.size,
      },
    });
  } catch (error) {
    logger.error('Error getting unread notification count:', error);
    next(error);
  }
};

// Create a new notification (for internal use, not exposed via API)
exports.createNotification = async (notificationData) => {
  try {
    const { userId, type, title, message, link, relatedId } = notificationData;
    
    if (!userId || !type || !title || !message) {
      throw new Error('Missing required notification fields');
    }
    
    // Create notification data
    const notification = {
      userId,
      type,
      title,
      message,
      link: link || null,
      relatedId: relatedId || null,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    
    // Add notification to Firestore
    const notificationRef = await firebase.db.collection('notifications').add(notification);
    
    // Add notification ID to user's notifications array
    await firebase.db.collection('users').doc(userId).update({
      notifications: firebase.db.FieldValue.arrayUnion(notificationRef.id),
    });
    
    return notificationRef.id;
  } catch (error) {
    logger.error('Error creating notification:', error);
    throw error;
  }
};
