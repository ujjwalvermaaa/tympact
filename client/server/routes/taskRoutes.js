const express = require('express');
const taskController = require('../controllers/taskController');
const { authenticate, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes (no authentication required)
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTask);

// Protected routes (require authentication)
router.use(authenticate);

// Task CRUD operations
router.post('/', taskController.createTask);
router.patch('/:id', taskController.updateTask);

// Task applications
router.post('/:id/apply', taskController.applyForTask);
router.post('/:id/assign', restrictTo('admin', 'task-owner'), taskController.assignTask);

// Task status updates
router.patch('/:id/start', taskController.startTask);
router.patch('/:id/complete', taskController.completeTask);
router.patch('/:id/cancel', restrictTo('admin', 'task-owner'), taskController.cancelTask);

// Task reviews
router.post('/:id/review', taskController.addTaskReview);

// Admin-only routes
router.use(restrictTo('admin'));
router.delete('/:id', taskController.deleteTask);
router.get('/admin/all', taskController.getAllTasksAdmin);

module.exports = router;
