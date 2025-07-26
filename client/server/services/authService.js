const jwt = require('jsonwebtoken');
const firebase = require('../config/firebase');
const AppError = require('../utils/appError');
const logger = require('../utils/logger');

// Sign JWT token
const signToken = (id, role = 'user') => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Create and send JWT token
const createAndSendToken = async (userId, statusCode, res) => {
  try {
    // 1) Get user data from Firestore
    const userDoc = await firebase.db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      throw new AppError('User not found!', 404);
    }

    const user = userDoc.data();

    // 2) Generate JWT token
    const token = signToken(userId, user.role);

    // 3) Set cookie options
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      sameSite: 'strict',
    };

    // 4) Set cookie
    res.cookie('jwt', token, cookieOptions);

    // 5) Remove sensitive data from output
    const userData = { ...user };
    delete userData.password;
    delete userData.passwordResetToken;
    delete userData.passwordResetExpires;

    // 6) Send response
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user: userData,
      },
    });
  } catch (error) {
    logger.error('Error in createAndSendToken:', error);
    throw error;
  }
};

// Verify JWT token
const verifyToken = async (token) => {
  try {
    if (!token) {
      throw new AppError('No token provided', 401);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const userDoc = await firebase.db.collection('users').doc(decoded.id).get();
    if (!userDoc.exists) {
      throw new AppError('The user belonging to this token no longer exists.', 401);
    }

    const user = userDoc.data();

    // Check if user changed password after the token was issued
    if (user.passwordChangedAt) {
      const changedTimestamp = Math.floor(user.passwordChangedAt.getTime() / 1000);
      if (decoded.iat < changedTimestamp) {
        throw new AppError('User recently changed password! Please log in again.', 401);
      }
    }

    return {
      id: userDoc.id,
      ...user,
    };
  } catch (error) {
    logger.error('Error verifying token:', error);
    throw error;
  }
};

// Generate password reset token
const generatePasswordResetToken = async (email) => {
  try {
    // 1) Get user by email
    const userSnapshot = await firebase.db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      throw new AppError('There is no user with that email address.', 404);
    }

    const userDoc = userSnapshot.docs[0];
    const user = { id: userDoc.id, ...userDoc.data() };

    // 2) Generate reset token (crypto.randomBytes is available in Node.js)
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // 3) Hash the token and save to database
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await firebase.db.collection('users').doc(user.id).update({
      passwordResetToken,
      passwordResetExpires,
    });

    // 4) Return unhashed token for email
    return resetToken;
  } catch (error) {
    logger.error('Error generating password reset token:', error);
    throw error;
  }
};

module.exports = {
  signToken,
  createAndSendToken,
  verifyToken,
  generatePasswordResetToken,
};
