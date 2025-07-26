const jwt = require('jsonwebtoken');
const firebase = require('../config/firebase');
const AppError = require('../utils/appError');
const logger = require('../utils/logger');

// Middleware to protect routes - requires authentication
exports.authenticate = async (req, res, next) => {
  try {
    let token;
    
    // 1) Get token from header or cookies
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }

    // 2) Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return next(
        new AppError('Invalid token. Please log in again!', 401)
      );
    }

    // 3) Check if user still exists
    const userRecord = await firebase.auth.getUser(decoded.id);
    if (!userRecord) {
      return next(
        new AppError('The user belonging to this token no longer exists.', 401)
      );
    }

    // 4) Check if user changed password after the token was issued
    if (decoded.iat < userRecord.passwordChangedAt / 1000) {
      return next(
        new AppError('User recently changed password! Please log in again.', 401)
      );
    }

    // 5) GRANT ACCESS TO PROTECTED ROUTE
    req.user = {
      uid: userRecord.uid,
      email: userRecord.email,
      role: userRecord.customClaims?.role || 'user',
    };

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    next(error);
  }
};

// Middleware to restrict routes to specific roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array of allowed roles ['admin', 'lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      // 1) Verify token
      const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);

      // 2) Check if user still exists
      const currentUser = await firebase.auth.getUser(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (decoded.iat < currentUser.passwordChangedAt / 1000) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    }
    next();
  } catch (err) {
    return next();
  }
};

// Middleware to check if user is authenticated via session (for server-side rendering)
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

// Middleware to check if user is not authenticated (for login/register pages)
exports.isNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/dashboard');
};
