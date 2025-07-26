const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const firebase = require('../config/firebase');
const logger = require('../utils/logger');
const AppError = require('../utils/appError');
const { sendEmail } = require('../services/emailService');
const { createAndSendToken } = require('../services/authService');

// Utility function to filter object fields
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const { email, password, passwordConfirm, name } = req.body;

    // 1) Check if passwords match
    if (password !== passwordConfirm) {
      return next(new AppError('Passwords do not match!', 400));
    }

    // 2) Create user in Firebase Auth
    const userRecord = await firebase.auth.createUser({
      email,
      password,
      displayName: name,
      emailVerified: false,
    });

    // 3) Create user document in Firestore
    const userData = {
      uid: userRecord.uid,
      email: userRecord.email,
      name: userRecord.displayName || name,
      role: 'user',
      timeBalance: 10, // Starting balance
      trustScore: 0,
      badges: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await firebase.db.collection('users').doc(userRecord.uid).set(userData);

    // 4) Generate email verification link
    const verificationLink = await firebase.auth.generateEmailVerificationLink(email);
    
    // 5) Send welcome email with verification link
    await sendEmail({
      email: userData.email,
      subject: 'Welcome to Tympact! Please verify your email',
      template: 'welcome',
      context: {
        name: userData.name,
        verificationLink,
      },
    });

    // 6) Log the user in by sending JWT
    createAndSendToken(userRecord.uid, 201, res);
  } catch (error) {
    logger.error('Registration error:', error);
    
    // Handle Firebase Auth errors
    if (error.code === 'auth/email-already-exists') {
      return next(new AppError('Email already in use!', 400));
    }
    if (error.code === 'auth/invalid-email') {
      return next(new AppError('Please provide a valid email!', 400));
    }
    if (error.code === 'auth/weak-password') {
      return next(new AppError('Password must be at least 6 characters!', 400));
    }
    
    next(new AppError('Error during registration. Please try again!', 500));
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }

    // 2) Sign in with email and password
    const { user } = await firebase.auth.signInWithEmailAndPassword(email, password);
    
    // 3) Check if user exists and password is correct
    if (!user) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // 4) If everything ok, send token to client
    createAndSendToken(user.uid, 200, res);
  } catch (error) {
    logger.error('Login error:', error);
    
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      return next(new AppError('Incorrect email or password', 401));
    }
    
    next(new AppError('Error during login. Please try again!', 500));
  }
};

// Logout user
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

// Forgot password
exports.forgotPassword = async (req, res, next) => {
  try {
    // 1) Get user based on POSTed email
    const { email } = req.body;
    if (!email) {
      return next(new AppError('Please provide an email address!', 400));
    }

    // 2) Check if user exists
    const userRecord = await firebase.auth.getUserByEmail(email);
    if (!userRecord) {
      return next(new AppError('There is no user with that email address.', 404));
    }

    // 3) Generate the password reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // 4) Save the reset token to the user's document
    await firebase.db.collection('users').doc(userRecord.uid).update({
      passwordResetToken,
      passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    // 5) Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`;
    
    try {
      await sendEmail({
        email: userRecord.email,
        subject: 'Your password reset token (valid for 10 min)',
        template: 'passwordReset',
        context: {
          name: userRecord.displayName || 'User',
          resetURL,
        },
      });

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!',
      });
    } catch (err) {
      await firebase.db.collection('users').doc(userRecord.uid).update({
        passwordResetToken: null,
        passwordResetExpires: null,
      });

      return next(
        new AppError('There was an error sending the email. Try again later!'),
        500
      );
    }
  } catch (error) {
    logger.error('Forgot password error:', error);
    next(error);
  }
};

// Reset password
exports.resetPassword = async (req, res, next) => {
  try {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // 2) Find user with the token and check if token hasn't expired
    const userSnapshot = await firebase.db.collection('users')
      .where('passwordResetToken', '==', hashedToken)
      .where('passwordResetExpires', '>', new Date())
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      return next(new AppError('Token is invalid or has expired', 400));
    }

    const userDoc = userSnapshot.docs[0];
    const user = { id: userDoc.id, ...userDoc.data() };

    // 3) Update password
    await firebase.auth.updateUser(user.uid, {
      password: req.body.password,
    });

    // 4) Update user document
    await firebase.db.collection('users').doc(user.uid).update({
      passwordResetToken: null,
      passwordResetExpires: null,
      passwordChangedAt: new Date().toISOString(),
    });

    // 5) Log the user in, send JWT
    createAndSendToken(user.uid, 200, res);
  } catch (error) {
    logger.error('Reset password error:', error);
    next(error);
  }
};

// Update password
exports.updatePassword = async (req, res, next) => {
  try {
    // 1) Get user from collection
    const userDoc = await firebase.db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists) {
      return next(new AppError('User not found!', 404));
    }

    const user = userDoc.data();

    // 2) Check if POSTed current password is correct
    try {
      await firebase.auth.signInWithEmailAndPassword(user.email, req.body.currentPassword);
    } catch (error) {
      return next(new AppError('Your current password is wrong.', 401));
    }

    // 3) If so, update password
    await firebase.auth.updateUser(user.uid, {
      password: req.body.newPassword,
    });

    // 4) Log user in, send JWT
    createAndSendToken(user.uid, 200, res);
  } catch (error) {
    logger.error('Update password error:', error);
    next(error);
  }
};

// Get current user
exports.getMe = (req, res, next) => {
  req.params.id = req.user.uid;
  next();
};

// Update current user data
exports.updateMe = async (req, res, next) => {
  try {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password updates. Please use /update-password.',
          400
        )
      );
    }

    // 2) Filtered out unwanted fields that are not allowed to be updated
    const filteredBody = filterObj(
      req.body,
      'name',
      'email',
      'bio',
      'skills',
      'photoURL',
      'timeZone'
    );

    // 3) Update user document
    await firebase.db.collection('users').doc(req.user.uid).update({
      ...filteredBody,
      updatedAt: new Date().toISOString(),
    });

    // 4) If email is being updated, update in Firebase Auth as well
    if (filteredBody.email) {
      await firebase.auth.updateUser(req.user.uid, {
        email: filteredBody.email,
        emailVerified: false, // Reset email verification status
      });

      // Send verification email
      const verificationLink = await firebase.auth.generateEmailVerificationLink(filteredBody.email);
      await sendEmail({
        email: filteredBody.email,
        subject: 'Please verify your new email address',
        template: 'emailChange',
        context: {
          name: filteredBody.name || 'User',
          verificationLink,
        },
      });
    }

    // 5) Send response
    const updatedUser = await firebase.db.collection('users').doc(req.user.uid).get();
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser.data(),
      },
    });
  } catch (error) {
    logger.error('Update me error:', error);
    next(error);
  }
};

// Delete current user (set active to false)
exports.deleteMe = async (req, res, next) => {
  try {
    await firebase.db.collection('users').doc(req.user.uid).update({
      active: false,
      updatedAt: new Date().toISOString(),
    });

    // Optionally, you can also delete the user from Firebase Auth
    // await firebase.auth.deleteUser(req.user.uid);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    logger.error('Delete me error:', error);
    next(error);
  }
};

// Verify email
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    
    // Verify the token with Firebase
    await firebase.auth.verifyIdToken(token);
    
    // Get user by email
    const user = await firebase.auth.getUserByEmail(req.user.email);
    
    // Update email verification status
    await firebase.auth.updateUser(user.uid, {
      emailVerified: true,
    });
    
    // Update user document
    await firebase.db.collection('users').doc(user.uid).update({
      emailVerified: true,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully!',
    });
  } catch (error) {
    logger.error('Verify email error:', error);
    next(new AppError('Email verification failed. Please try again!', 400));
  }
};

// Restrict to specific roles
exports.restrictTo = (...roles) => {
  return async (req, res, next) => {
    try {
      // Get user document
      const userDoc = await firebase.db.collection('users').doc(req.user.uid).get();
      if (!userDoc.exists) {
        return next(new AppError('User not found!', 404));
      }

      const user = userDoc.data();

      // Check if user has the required role
      if (!roles.includes(user.role)) {
        return next(
          new AppError('You do not have permission to perform this action', 403)
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res, next) => {
  try {
    const usersSnapshot = await firebase.db.collection('users').get();
    const users = [];
    
    usersSnapshot.forEach(doc => {
      users.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    logger.error('Get all users error:', error);
    next(error);
  }
};
