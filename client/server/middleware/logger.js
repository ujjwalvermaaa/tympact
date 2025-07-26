const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');
const onHeaders = require('on-headers');
const { performance } = require('perf_hooks');

// Request ID middleware
const requestId = (req, res, next) => {
  // Generate a unique request ID if it doesn't exist
  req.id = req.headers['x-request-id'] || uuidv4();
  
  // Set the request ID in the response headers
  res.setHeader('X-Request-ID', req.id);
  
  next();
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  // Skip health check endpoints
  if (req.path === '/health' || req.path === '/api/health') {
    return next();
  }
  
  // Start timing the request
  const start = process.hrtime();
  
  // Generate a unique request ID if not already set
  req.id = req.id || uuidv4();
  
  // Log the incoming request
  const requestInfo = {
    requestId: req.id,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
    referrer: req.get('referer') || '',
    timestamp: new Date().toISOString(),
    headers: { ...req.headers },
    body: { ...req.body },
    query: { ...req.query },
    params: { ...req.params },
  };
  
  // Redact sensitive information
  if (requestInfo.body.password) requestInfo.body.password = '[REDACTED]';
  if (requestInfo.body.newPassword) requestInfo.body.newPassword = '[REDACTED]';
  if (requestInfo.body.confirmPassword) requestInfo.body.confirmPassword = '[REDACTED]';
  if (requestInfo.body.token) requestInfo.body.token = '[REDACTED]';
  if (requestInfo.headers.authorization) requestInfo.headers.authorization = '[REDACTED]';
  
  // Log the request at debug level
  logger.debug('Incoming request', requestInfo);
  
  // Function to log the response
  const logResponse = () => {
    // Calculate response time
    const diff = process.hrtime(start);
    const responseTime = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2); // in ms
    
    // Get response status
    const statusCode = res.statusCode;
    
    // Log the response
    const responseInfo = {
      requestId: req.id,
      method: req.method,
      url: req.originalUrl,
      statusCode,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
      contentLength: res.get('content-length') || 0,
      user: req.user ? req.user.id : 'anonymous',
    };
    
    // Log at appropriate level based on status code
    if (statusCode >= 500) {
      logger.error('Server error response', responseInfo);
    } else if (statusCode >= 400) {
      logger.warn('Client error response', responseInfo);
    } else {
      logger.info('Request completed', responseInfo);
    }
  };
  
  // Log when response is finished
  onHeaders(res, logResponse);
  
  next();
};

// Error logging middleware
const errorLogger = (err, req, res, next) => {
  const errorInfo = {
    requestId: req.id,
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    error: {
      name: err.name,
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
      statusCode: err.statusCode || 500,
      isOperational: err.isOperational || false,
    },
    user: req.user ? req.user.id : 'anonymous',
  };
  
  // Log the error
  logger.error('Request error', errorInfo);
  
  next(err);
};

// Performance monitoring middleware
const performanceMonitor = (req, res, next) => {
  // Skip health check endpoints
  if (req.path === '/health' || req.path === '/api/health') {
    return next();
  }
  
  const start = performance.now();
  
  res.on('finish', () => {
    const duration = performance.now() - start;
    const { method, originalUrl } = req;
    const { statusCode } = res;
    
    // Log slow requests
    if (duration > 1000) { // More than 1 second is considered slow
      logger.warn('Slow request detected', {
        requestId: req.id,
        method,
        url: originalUrl,
        statusCode,
        duration: `${duration.toFixed(2)}ms`,
        threshold: '1000ms',
      });
    }
    
    // Log API performance metrics
    logger.info('API Performance', {
      requestId: req.id,
      endpoint: `${method} ${originalUrl}`,
      statusCode,
      duration: `${duration.toFixed(2)}ms`,
      timestamp: new Date().toISOString(),
    });
  });
  
  next();
};

// Request validation error formatter
const validationErrorFormatter = (req, res, next) => {
  // Save original json method
  const originalJson = res.json;
  
  // Override json method to format validation errors
  res.json = (body) => {
    // Check if this is a validation error
    if (body && body.errors) {
      const formattedErrors = {};
      
      // Format validation errors
      for (const [field, error] of Object.entries(body.errors)) {
        if (error && error.msg) {
          formattedErrors[field] = error.msg;
        }
      }
      
      // Create a clean error response
      const errorResponse = {
        status: 'error',
        message: 'Validation failed',
        errors: formattedErrors,
        requestId: req.id,
        timestamp: new Date().toISOString(),
      };
      
      // Log the validation error
      logger.warn('Validation error', {
        requestId: req.id,
        method: req.method,
        url: req.originalUrl,
        errors: formattedErrors,
      });
      
      return originalJson.call(res, errorResponse);
    }
    
    // For non-error responses, just pass through
    return originalJson.call(res, body);
  };
  
  next();
};

// Security logging middleware
const securityLogger = (req, res, next) => {
  // Check for potential security issues
  const securityChecks = {
    xssDetected: /[<>]/.test(JSON.stringify(req.body)) || /[<>]/.test(JSON.stringify(req.query)),
    sqlInjectionDetected: /(['";]+|(--[^\r\n]*)|(\/\*[\w\W]*?(?=\*)\*\/))/.test(JSON.stringify(req.body) + JSON.stringify(req.query)),
    suspiciousPath: /(\.\.\/|\.\.\\)/.test(req.path),
    missingCSRFToken: req.method === 'POST' && !req.headers['x-csrf-token'] && !req.headers['x-requested-with'],
  };
  
  // Log security events if any checks fail
  const securityIssues = Object.entries(securityChecks)
    .filter(([_, value]) => value)
    .map(([key]) => key);
  
  if (securityIssues.length > 0) {
    logger.warn('Potential security issue detected', {
      requestId: req.id,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      issues: securityIssues,
      timestamp: new Date().toISOString(),
    });
  }
  
  next();
};

module.exports = {
  requestId,
  requestLogger,
  errorLogger,
  performanceMonitor,
  validationErrorFormatter,
  securityLogger,
};
