const firebase = require('../config/firebase');
const AppError = require('../utils/appError');
const logger = require('../utils/logger');

// Helper function to get public user profile (excludes sensitive data)
const getPublicProfile = (user) => {
  if (!user) return null;

  const publicFields = [
    'uid',
    'name',
    'email',
    'photoURL',
    'bio',
    'skills',
    'timeBalance',
    'trustScore',
    'rating',
    'completedTasks',
    'createdAt',
    'badges',
    'socialLinks',
    'timeZone',
    'preferences',
  ];

  const publicProfile = {};
  publicFields.forEach(field => {
    if (user[field] !== undefined) {
      publicProfile[field] = user[field];
    }
  });

  return publicProfile;
};

// Get current user's profile
exports.getMe = async (req, res, next) => {
  try {
    const userDoc = await firebase.db.collection('users').doc(req.user.uid).get();

    if (!userDoc.exists) {
      return next(new AppError('User not found', 404));
    }

    const userData = userDoc.data();
    res.status(200).json({
      status: 'success',
      data: {
        user: userData,
      },
    });
  } catch (error) {
    logger.error('Error getting user profile:', error);
    next(error);
  }
};

// Get public profile of any user
exports.getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userDoc = await firebase.db.collection('users').doc(id).get();

    if (!userDoc.exists) {
      return next(new AppError('User not found', 404));
    }

    const userData = userDoc.data();
    const publicProfile = getPublicProfile(userData);

    res.status(200).json({
      status: 'success',
      data: {
        user: publicProfile,
      },
    });
  } catch (error) {
    logger.error('Error getting user profile:', error);
    next(error);
  }
};

// Update user profile
exports.updateMe = async (req, res, next) => {
  try {
    const { name, bio, skills, socialLinks, timeZone, preferences } = req.body;
    const userId = req.user.uid;

    // Filter out fields that are not allowed to be updated
    const filteredBody = {};
    if (name) filteredBody.name = name;
    if (bio !== undefined) filteredBody.bio = bio;
    if (skills) filteredBody.skills = skills;
    if (socialLinks) filteredBody.socialLinks = socialLinks;
    if (timeZone) filteredBody.timeZone = timeZone;
    if (preferences) filteredBody.preferences = preferences;

    // Add updatedAt timestamp
    filteredBody.updatedAt = new Date().toISOString();

    // Update user document
    await firebase.db.collection('users').doc(userId).update(filteredBody);

    // Get updated user data
    const userDoc = await firebase.db.collection('users').doc(userId).get();
    const userData = userDoc.data();

    res.status(200).json({
      status: 'success',
      data: {
        user: userData,
      },
    });
  } catch (error) {
    logger.error('Error updating user profile:', error);
    next(error);
  }
};

// Upload user profile photo
exports.uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('Please upload a file', 400));
    }

    const userId = req.user.uid;
    const file = req.file;

    // Generate a unique filename
    const filename = `users/${userId}/profile-${Date.now()}-${Math.round(Math.random() * 1e9)}.${file.originalname.split('.').pop()}`;

    // Create a reference to the file
    const fileRef = firebase.storage.bucket().file(filename);

    // Create a write stream to upload the file
    const blobStream = fileRef.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
      resumable: false,
    });

    // Handle stream events
    blobStream.on('error', (error) => {
      logger.error('Error uploading file:', error);
      return next(new AppError('Error uploading file', 500));
    });

    blobStream.on('finish', async () => {
      try {
        // Make the file public
        await fileRef.makePublic();

        // Get the public URL
        const photoURL = `https://storage.googleapis.com/${storage.bucket().name}/${filename}`;

        // Update user's photoURL in Firestore
        await firebase.db.collection('users').doc(userId).update({
          photoURL,
          updatedAt: new Date().toISOString(),
        });

        res.status(200).json({
          status: 'success',
          data: {
            photoURL,
          },
        });
      } catch (error) {
        logger.error('Error updating user photo URL:', error);
        next(error);
      }
    });

    // End the stream
    blobStream.end(file.buffer);
  } catch (error) {
    logger.error('Error uploading photo:', error);
    next(error);
  }
};

// Get user's tasks
exports.getUserTasks = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, type = 'all', page = 1, limit = 10 } = req.query;

    let query = firebase.db.collection('tasks');

    // Filter by task type
    if (type === 'created') {
      query = query.where('createdBy', '==', id);
    } else if (type === 'assigned') {
      query = query.where('assignedTo', '==', id);
    } else if (type === 'completed') {
      query = query.where('assignedTo', '==', id).where('status', '==', 'completed');
    } else {
      query = query.where('assignedTo', '==', id).where('status', 'in', ['assigned', 'in-progress']);
    }

    // Apply status filter if provided
    if (status) {
      query = query.where('status', '==', status);
    }

    // Get total count for pagination
    const snapshot = await query.get();
    const totalTasks = snapshot.size;
    const totalPages = Math.ceil(totalTasks / limit);
    const skip = (page - 1) * limit;

    // Apply pagination and get tasks
    const tasksSnapshot = await query
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset(skip)
      .get();

    const tasks = [];
    tasksSnapshot.forEach(doc => {
      tasks.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).json({
      status: 'success',
      results: tasks.length,
      total: totalTasks,
      totalPages,
      currentPage: parseInt(page),
      data: {
        tasks,
      },
    });
  } catch (error) {
    logger.error('Error getting user tasks:', error);
    next(error);
  }
};

// Get user's notifications
exports.getNotifications = async (req, res, next) => {
  try {
    const { isRead, type, limit = 20 } = req.query;
    const userId = req.user.uid;

    let query = firebase.db.collection('notifications')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit));

    // Apply filters
    if (isRead !== undefined) {
      query = query.where('isRead', '==', isRead === 'true');
    }

    if (type) {
      query = query.where('type', '==', type);
    }

    const snapshot = await query.get();
    const notifications = [];
    snapshot.forEach(doc => {
      notifications.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).json({
      status: 'success',
      results: notifications.length,
      data: {
        notifications,
      },
    });
  } catch (error) {
    logger.error('Error getting notifications:', error);
    next(error);
  }
};

// Mark notification as read
exports.markNotificationAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    // Verify the notification belongs to the user
    const notificationRef = firebase.db.collection('notifications').doc(id);
    const notificationDoc = await notificationRef.get();

    if (!notificationDoc.exists) {
      return next(new AppError('Notification not found', 404));
    }

    if (notificationDoc.data().userId !== userId) {
      return next(new AppError('Not authorized to update this notification', 403));
    }

    // Update notification
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
exports.markAllNotificationsAsRead = async (req, res, next) => {
  try {
    const userId = req.user.uid;

    // Get all unread notifications
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
      message: `${snapshot.size} notifications marked as read`,
    });
  } catch (error) {
    logger.error('Error marking all notifications as read:', error);
    next(error);
  }
};

// Get user's time balance and statistics
exports.getUserStats = async (req, res, next) => {
  try {
    const userId = req.user.uid;

    // Get user data
    const userDoc = await firebase.db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return next(new AppError('User not found', 404));
    }

    const userData = userDoc.data();

    // Get user's tasks
    const createdTasksQuery = await firebase.db.collection('tasks')
      .where('createdBy', '==', userId)
      .get();

    const assignedTasksQuery = await firebase.db.collection('tasks')
      .where('assignedTo', '==', userId)
      .get();

    const completedTasksQuery = await firebase.db.collection('tasks')
      .where('assignedTo', '==', userId)
      .where('status', '==', 'completed')
      .get();

    // Calculate statistics
    const stats = {
      timeBalance: userData.timeBalance || 0,
      trustScore: userData.trustScore || 0,
      rating: userData.rating || 0,
      tasks: {
        created: createdTasksQuery.size,
        assigned: assignedTasksQuery.size,
        completed: completedTasksQuery.size,
      },
      timeSpent: 0,
      timeEarned: 0,
    };

    // Calculate time spent and earned
    completedTasksQuery.forEach(doc => {
      const task = doc.data();
      stats.timeSpent += task.duration || 0;
      stats.timeEarned += task.duration || 0; // Assuming duration is time earned
    });

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (error) {
    logger.error('Error getting user stats:', error);
    next(error);
  }
};

// ADMIN-ONLY FUNCTIONS

// Get all users (for admins)
exports.getAllUsers = async (req, res, next) => {
  try {
    const usersSnapshot = await firebase.db.collection('users').get();
    const users = [];
    usersSnapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    logger.error('Error getting all users:', error);
    next(error);
  }
};

// Update any user (for admins)
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: new Date().toISOString() };

    // Update in Firestore
    await firebase.db.collection('users').doc(id).update(updateData);

    // If email is updated, update in Firebase Auth as well
    if (updateData.email) {
      await firebase.auth.updateUser(id, { email: updateData.email });
    }

    res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
    });
  } catch (error) {
    logger.error('Error updating user:', error);
    next(error);
  }
};

// Delete any user (for admins)
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Delete from Firebase Auth
    await firebase.auth.deleteUser(id);

    // Delete from Firestore
    await firebase.db.collection('users').doc(id).delete();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    logger.error('Error deleting user:', error);
    next(error);
  }
};
