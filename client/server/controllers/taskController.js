const firebase = require('../config/firebase');
const AppError = require('../utils/appError');
const logger = require('../utils/logger');

// Helper to create notifications
async function createNotification(data) {
  try {
    await firebase.db.collection('notifications').add({
      ...data,
      isRead: false,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Error creating notification:', error);
  }
}

// Helper function to transfer time credits when a task is completed
async function transferTaskCredits(task, taskId) {
  const batch = firebase.db.batch();

  // Get creator and assignee data
  const creatorRef = firebase.db.collection('users').doc(task.createdBy);
  const assigneeRef = firebase.db.collection('users').doc(task.assignedTo);

  // Update creator's time balance (deduct task value)
  batch.update(creatorRef, {
    timeBalance: firebase.db.FieldValue.increment(-task.value),
    updatedAt: new Date().toISOString(),
  });

  // Update assignee's time balance (add task value)
  batch.update(assigneeRef, {
    timeBalance: firebase.db.FieldValue.increment(task.value),
    completedTasks: firebase.db.FieldValue.increment(1),
    updatedAt: new Date().toISOString(),
  });

  // Commit the batch
  await batch.commit();

  // Create notifications
  await createNotification({
    userId: task.createdBy,
    type: 'task_completed',
    title: 'Task Completed',
    message: `Your task "${task.title}" has been marked as complete.`,
    link: `/tasks/${taskId}`,
  });

  await createNotification({
    userId: task.assignedTo,
    type: 'time_credit_received',
    title: 'Time Credit Received',
    message: `You have received ${task.value} time credits for completing "${task.title}".`,
    link: `/tasks/${taskId}`,
  });
}

// Helper function to calculate task value based on complexity and duration
const calculateTaskValue = (complexity, duration) => {
  const complexityMultiplier = {
    'very-low': 0.5,
    'low': 0.75,
    'medium': 1,
    'high': 1.5,
    'very-high': 2,
  };
  const baseValuePerHour = 10; // in time credits
  const value = Math.ceil(duration * baseValuePerHour * (complexityMultiplier[complexity] || 1));
  return value;
};

// Create a new task
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, category, complexity, duration, skillsRequired } = req.body;
    const userId = req.user.uid;

    if (!title || !category || !complexity || !duration) {
      return next(new AppError('Please provide all required fields', 400));
    }

    const value = calculateTaskValue(complexity, duration);

    const taskData = {
      title,
      description: description || '',
      category,
      complexity,
      duration,
      value,
      skillsRequired: skillsRequired || [],
      status: 'open',
      createdBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      applicants: [],
      assignedTo: null,
      completedAt: null,
    };

    const taskRef = await firebase.db.collection('tasks').add(taskData);
    const task = { id: taskRef.id, ...taskData };

    await firebase.db.collection('users').doc(userId).update({
      createdTasks: firebase.db.FieldValue.arrayUnion(taskRef.id),
      updatedAt: new Date().toISOString(),
    });

    logger.info(`Task created: ${task.id} by user ${userId}`);

    res.status(201).json({
      status: 'success',
      data: {
        task,
      },
    });
  } catch (error) {
    logger.error('Error creating task:', error);
    next(error);
  }
};

// Get all tasks with filtering and pagination
exports.getAllTasks = async (req, res, next) => {
  try {
    const { status, category, minValue, maxValue, page = 1, limit = 10 } = req.query;
    let query = firebase.db.collection('tasks');

    if (status) query = query.where('status', '==', status);
    if (category) query = query.where('category', '==', category);
    if (minValue) query = query.where('value', '>=', parseInt(minValue));
    if (maxValue) query = query.where('value', '<=', parseInt(maxValue));

    const snapshot = await query.get();
    const totalTasks = snapshot.size;
    const totalPages = Math.ceil(totalTasks / limit);
    const skip = (page - 1) * limit;

    const tasksSnapshot = await query.orderBy('createdAt', 'desc').limit(parseInt(limit)).offset(skip).get();

    const tasks = [];
    tasksSnapshot.forEach(doc => {
      tasks.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    const userIds = [...new Set(tasks.map(task => task.createdBy))].filter(id => id);
    let usersMap = {};

    if (userIds.length > 0) {
      const usersSnapshot = await firebase.db.collection('users').where(db.FieldPath.documentId(), 'in', userIds).get();
      usersSnapshot.forEach(doc => {
        const user = doc.data();
        usersMap[doc.id] = {
          name: user.name,
          photoURL: user.photoURL,
          rating: user.rating,
        };
      });
    }

    const tasksWithUsers = tasks.map(task => ({
      ...task,
      creator: usersMap[task.createdBy] || null,
    }));

    res.status(200).json({
      status: 'success',
      results: tasksWithUsers.length,
      total: totalTasks,
      totalPages,
      currentPage: parseInt(page),
      data: {
        tasks: tasksWithUsers,
      },
    });
  } catch (error) {
    logger.error('Error getting tasks:', error);
    next(error);
  }
};

// Get a single task by ID
exports.getTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const taskDoc = await firebase.db.collection('tasks').doc(id).get();
    if (!taskDoc.exists) {
      return next(new AppError('No task found with that ID', 404));
    }

    const task = { id: taskDoc.id, ...taskDoc.data() };

    let creator = null;
    if (task.createdBy) {
      const creatorDoc = await firebase.db.collection('users').doc(task.createdBy).get();
      if (creatorDoc.exists) {
        creator = {
          name: creatorDoc.data().name,
          photoURL: creatorDoc.data().photoURL,
          rating: creatorDoc.data().rating,
          completedTasks: creatorDoc.data().completedTasks || 0,
        };
      }
    }

    let assignee = null;
    if (task.assignedTo) {
      const assigneeDoc = await firebase.db.collection('users').doc(task.assignedTo).get();
      if (assigneeDoc.exists) {
        assignee = {
          name: assigneeDoc.data().name,
          photoURL: assigneeDoc.data().photoURL,
          rating: assigneeDoc.data().rating,
        };
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        task: {
          ...task,
          creator,
          assignee,
        },
      },
    });
  } catch (error) {
    logger.error('Error getting task:', error);
    next(error);
  }
};

// Update a task
exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;
    const updateData = { ...req.body, updatedAt: new Date().toISOString() };

    const taskDoc = await firebase.db.collection('tasks').doc(id).get();
    if (!taskDoc.exists) {
      return next(new AppError('No task found with that ID', 404));
    }

    const task = taskDoc.data();

    if (task.createdBy !== userId && req.user.role !== 'admin') {
      return next(new AppError('You are not authorized to update this task', 403));
    }

    await firebase.db.collection('tasks').doc(id).update(updateData);
    const updatedTaskDoc = await firebase.db.collection('tasks').doc(id).get();
    const updatedTask = { id: updatedTaskDoc.id, ...updatedTaskDoc.data() };

    res.status(200).json({
      status: 'success',
      data: {
        task: updatedTask,
      },
    });
  } catch (error) {
    logger.error('Error updating task:', error);
    next(error);
  }
};

// Apply for a task
exports.applyForTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;
    const { message } = req.body;

    const taskRef = firebase.db.collection('tasks').doc(id);
    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      return next(new AppError('No task found with that ID', 404));
    }

    const task = taskDoc.data();

    if (task.status !== 'open') {
      return next(new AppError('This task is not open for applications', 400));
    }

    if (task.createdBy === userId) {
      return next(new AppError('You cannot apply to your own task', 400));
    }

    if (task.applicants && task.applicants.some(app => app.userId === userId)) {
      return next(new AppError('You have already applied to this task', 400));
    }

    const application = {
      userId,
      message: message || '',
      appliedAt: new Date().toISOString(),
      status: 'pending',
    };

    await taskRef.update({
      applicants: firebase.db.FieldValue.arrayUnion(application),
      updatedAt: new Date().toISOString(),
    });

    await createNotification({
      userId: task.createdBy,
      type: 'new_application',
      title: 'New Application',
      message: `${req.user.name} has applied to your task "${task.title}"`,
      link: `/tasks/${id}`,
      relatedId: id,
    });

    res.status(200).json({
      status: 'success',
      message: 'Application submitted successfully',
    });
  } catch (error) {
    logger.error('Error applying for task:', error);
    next(error);
  }
};

// Assign a task to a user
exports.assignTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const taskRef = firebase.db.collection('tasks').doc(id);

    const taskDoc = await firebase.db.runTransaction(async (transaction) => {
      const doc = await transaction.get(taskRef);
      if (!doc.exists) {
        throw new AppError('No task found with that ID', 404);
      }
      const task = doc.data();
      if (task.createdBy !== req.user.uid && req.user.role !== 'admin') {
        throw new AppError('You are not authorized to assign this task', 403);
      }
      if (task.status !== 'open') {
        throw new AppError('Cannot assign a task that is not open', 400);
      }
      const hasApplied = task.applicants && task.applicants.some(app => app.userId === userId);
      if (!hasApplied) {
        throw new AppError('This user has not applied to this task', 400);
      }
      transaction.update(taskRef, {
        assignedTo: userId,
        status: 'in-progress',
        updatedAt: new Date().toISOString(),
      });
      return doc;
    });

    await createNotification({
      userId,
      type: 'task_assigned',
      title: 'Task Assigned',
      message: `You've been assigned to the task "${taskDoc.data().title}"`,
      link: `/tasks/${id}`,
      relatedId: id,
    });

    res.status(200).json({
      status: 'success',
      message: 'Task assigned successfully',
    });
  } catch (error) {
    logger.error('Error assigning task:', error);
    next(error);
  }
};

// Start a task
exports.startTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const taskRef = firebase.db.collection('tasks').doc(id);
    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      return next(new AppError('No task found with that ID', 404));
    }

    const task = taskDoc.data();

    if (task.assignedTo !== userId) {
      return next(new AppError('You are not assigned to this task', 403));
    }

    if (task.status !== 'assigned') {
      return next(new AppError('Task must be assigned to be started.', 400));
    }

    await taskRef.update({
      status: 'in-progress',
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({ status: 'success', message: 'Task started successfully' });
  } catch (error) {
    logger.error('Error starting task:', error);
    next(error);
  }
};

// Complete a task
exports.completeTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const taskRef = firebase.db.collection('tasks').doc(id);
    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      return next(new AppError('No task found with that ID', 404));
    }

    const task = taskDoc.data();

    if (task.assignedTo !== userId) {
      return next(new AppError('You are not assigned to this task', 403));
    }

    if (task.status !== 'in-progress') {
      return next(new AppError('Task must be in progress to be completed', 400));
    }

    await taskRef.update({
      status: 'completed',
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await transferTaskCredits(task, id);

    res.status(200).json({ status: 'success', message: 'Task completed successfully' });
  } catch (error) {
    logger.error('Error completing task:', error);
    next(error);
  }
};

// Cancel a task
exports.cancelTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const taskRef = firebase.db.collection('tasks').doc(id);
    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      return next(new AppError('No task found with that ID', 404));
    }

    const task = taskDoc.data();

    if (task.createdBy !== userId && req.user.role !== 'admin') {
      return next(new AppError('You are not authorized to cancel this task', 403));
    }

    if (task.status === 'completed' || task.status === 'cancelled') {
      return next(new AppError('Cannot cancel a task that is already completed or cancelled', 400));
    }

    await taskRef.update({
      status: 'cancelled',
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({ status: 'success', message: 'Task cancelled successfully' });
  } catch (error) {
    logger.error('Error cancelling task:', error);
    next(error);
  }
};

// Add a review to a task
exports.addTaskReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.uid;

    const taskRef = firebase.db.collection('tasks').doc(id);
    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      return next(new AppError('No task found with that ID', 404));
    }

    const task = taskDoc.data();

    if (task.createdBy !== userId) {
      return next(new AppError('Only the task creator can leave a review', 403));
    }

    if (task.status !== 'completed') {
      return next(new AppError('Can only review completed tasks', 400));
    }

    const review = {
      rating,
      comment,
      reviewedBy: userId,
      reviewedAt: new Date().toISOString(),
    };

    await taskRef.update({ review });

    res.status(201).json({ status: 'success', data: { review } });
  } catch (error) {
    logger.error('Error adding task review:', error);
    next(error);
  }
};

// Delete a task (admin only)
exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    await firebase.db.collection('tasks').doc(id).delete();
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    logger.error('Error deleting task:', error);
    next(error);
  }
};

// Get all tasks for admin view
exports.getAllTasksAdmin = async (req, res, next) => {
  try {
    const snapshot = await firebase.db.collection('tasks').get();
    const tasks = [];
    snapshot.forEach(doc => {
      tasks.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json({ status: 'success', results: tasks.length, data: { tasks } });
  } catch (error) {
    logger.error('Error getting all tasks for admin:', error);
    next(error);
  }
};


