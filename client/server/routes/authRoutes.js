const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.get('/verify-email/:token', authController.verifyEmail);

// Protected routes (require authentication)
router.use(authenticate);

router.patch('/update-password', authController.updatePassword);
router.post('/logout', authController.logout);
router.get('/me', authController.getMe, userController.getUser);
router.patch('/update-me', authController.updateMe);
router.delete('/delete-me', authController.deleteMe);

// Admin routes
router.use(authController.restrictTo('admin'));
router.get('/users', authController.getAllUsers);

module.exports = router;
