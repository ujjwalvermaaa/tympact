const express = require('express');
const multer = require('multer');
const userController = require('../controllers/userController');
const { authenticate, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload only images.'), false);
    }
  },
});

// Public routes (no authentication required)
router.get('/:id', userController.getUser);
router.get('/:id/tasks', userController.getUserTasks);

// Protected routes (require authentication)
router.use(authenticate);

// Current user routes
router.get('/me', userController.getMe);
router.patch('/me', userController.updateMe);
router.post('/me/photo', upload.single('photo'), userController.uploadPhoto);
router.get('/me/notifications', userController.getNotifications);
router.patch('/me/notifications/read', userController.markAllNotificationsAsRead);
router.patch('/me/notifications/:id/read', userController.markNotificationAsRead);
router.get('/me/stats', userController.getUserStats);

// Admin routes
router.use(restrictTo('admin'));
router.get('/', userController.getAllUsers);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
