const firebase = require('../config/firebase');
const AppError = require('../utils/appError');
const logger = require('../utils/logger');

exports.getCommunityStats = async (req, res, next) => {
  try {
    const usersSnapshot = await firebase.db.collection('users').get();
    const activeMembers = usersSnapshot.size;

    const tasksSnapshot = await firebase.db.collection('tasks').where('status', '==', 'completed').get();
    const tasksCompleted = tasksSnapshot.size;

    // For now, we'll use the count of completed tasks as a proxy for projects collaborated on.
    const projectsCollaboratedOn = tasksCompleted;

    res.status(200).json({
      status: 'success',
      data: {
        activeMembers,
        tasksCompleted,
        projectsCollaboratedOn,
      },
    });
  } catch (error) {
    logger.error('Error getting community stats:', error);
    next(error);
  }
};

exports.getRecentActivity = async (req, res, next) => {
  try {
    const tasksSnapshot = await firebase.db.collection('tasks')
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get();

    if (tasksSnapshot.empty) {
      return res.status(200).json({
        status: 'success',
        data: [],
      });
    }

    const activityPromises = tasksSnapshot.docs.map(async (doc) => {
      const task = doc.data();
      let userName = 'An unknown user';

      if (task.createdBy) {
        const userDoc = await firebase.db.collection('users').doc(task.createdBy).get();
        if (userDoc.exists) {
          userName = userDoc.data().name || 'A user';
        }
      }
      
      return {
        user: userName,
        action: `posted a new task: "${task.title}"`,
        time: task.createdAt,
      };
    });

    const activities = await Promise.all(activityPromises);

    res.status(200).json({
      status: 'success',
      data: activities,
    });
  } catch (error) {
    logger.error('Error getting recent activity:', error);
    next(error);
  }
};
