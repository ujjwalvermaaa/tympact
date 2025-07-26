const rateLimit = require('express-rate-limit');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const AppError = require('../utils/appError');
const logger = require('../utils/logger');

// Global rate limiting
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again in 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}, Path: ${req.path}`);
    next(new AppError(options.message, 429));
  },
});

// Authentication rate limiting (more strict)
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 login attempts per windowMs
  message: 'Too many login attempts from this IP, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
    next(new AppError(options.message, 429));
  },
});

// API key rate limiting (for public APIs)
const apiKeyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 500, // 500 requests per hour per API key
  keyGenerator: (req) => {
    return req.headers['x-api-key'] || req.query.apiKey || 'no-key';
  },
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    const apiKey = req.headers['x-api-key'] || req.query.apiKey || 'no-key';
    logger.warn(`API rate limit exceeded for key: ${apiKey}`);
    next(new AppError(options.message, 429));
  },
});

// Rate limiting for password reset endpoints
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 attempts per hour per IP
  message: 'Too many password reset attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn(`Password reset limit exceeded for IP: ${req.ip}`);
    next(new AppError(options.message, 429));
  },
});

// Rate limiting for account creation
const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 accounts per hour per IP
  message: 'Too many accounts created from this IP, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn(`Account creation limit exceeded for IP: ${req.ip}`);
    next(new AppError(options.message, 429));
  },
});

// Rate limiting for file uploads
const fileUploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 uploads per 15 minutes per IP
  message: 'Too many file uploads, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn(`File upload limit exceeded for IP: ${req.ip}`);
    next(new AppError(options.message, 429));
  },
});

// Rate limiting for search endpoints
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute per IP
  message: 'Too many search requests, please try again in a minute',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn(`Search limit exceeded for IP: ${req.ip}`);
    next(new AppError(options.message, 429));
  },
});

// Rate limiting for OTP verification
const otpLimiter = new RateLimiterMemory({
  points: 5, // 5 attempts
  duration: 60 * 60, // per 1 hour
  blockDuration: 60 * 60, // block for 1 hour after 5 attempts
});

const verifyOtpLimiter = async (req, res, next) => {
  try {
    const ip = req.ip;
    const rateLimitRes = await otpLimiter.consume(ip);
    
    // Add rate limit headers to the response
    res.set({
      'Retry-After': Math.ceil(rateLimitRes.msBeforeNext / 1000),
      'X-RateLimit-Limit': 5,
      'X-RateLimit-Remaining': rateLimitRes.remainingPoints,
      'X-RateLimit-Reset': new Date(Date.now() + rateLimitRes.msBeforeNext).toISOString(),
    });
    
    next();
  } catch (rateLimitRes) {
    logger.warn(`OTP verification limit exceeded for IP: ${req.ip}`);
    
    res.set({
      'Retry-After': Math.ceil(rateLimitRes.msBeforeNext / 1000),
      'X-RateLimit-Limit': 5,
      'X-RateLimit-Remaining': 0,
      'X-RateLimit-Reset': new Date(Date.now() + rateLimitRes.msBeforeNext).toISOString(),
    });
    
    next(new AppError('Too many OTP attempts, please try again later', 429));
  }
};

// Rate limiting for password reset tokens
const passwordResetTokenLimiter = new RateLimiterMemory({
  points: 3, // 3 attempts
  duration: 60 * 60, // per 1 hour
  blockDuration: 60 * 60, // block for 1 hour after 3 attempts
});

const passwordResetTokenLimiterMiddleware = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return next();
    
    const rateLimitRes = await passwordResetTokenLimiter.consume(email);
    
    // Add rate limit headers to the response
    res.set({
      'Retry-After': Math.ceil(rateLimitRes.msBeforeNext / 1000),
      'X-RateLimit-Limit': 3,
      'X-RateLimit-Remaining': rateLimitRes.remainingPoints,
      'X-RateLimit-Reset': new Date(Date.now() + rateLimitRes.msBeforeNext).toISOString(),
    });
    
    next();
  } catch (rateLimitRes) {
    logger.warn(`Password reset token limit exceeded for email: ${req.body.email}`);
    
    res.set({
      'Retry-After': Math.ceil(rateLimitRes.msBeforeNext / 1000),
      'X-RateLimit-Limit': 3,
      'X-RateLimit-Remaining': 0,
      'X-RateLimit-Reset': new Date(Date.now() + rateLimitRes.msBeforeNext).toISOString(),
    });
    
    next(new AppError('Too many password reset attempts, please try again later', 429));
  }
};

module.exports = {
  globalRateLimiter,
  authLimiter,
  apiKeyLimiter,
  passwordResetLimiter,
  createAccountLimiter,
  fileUploadLimiter,
  searchLimiter,
  verifyOtpLimiter,
  passwordResetTokenLimiter: passwordResetTokenLimiterMiddleware,
};
