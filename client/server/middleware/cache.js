const { createClient } = require('redis');
const { promisify } = require('util');
const logger = require('../utils/logger');
const AppError = require('../utils/appError');

// Create Redis client
let redisClient;
let getAsync;
let setAsync;
let delAsync;
let keysAsync;

// Initialize Redis client
const initializeRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            logger.error('Too many retries on Redis. Connection terminated');
            return new Error('Too many retries on Redis connection');
          }
          // Reconnect after this time (ms)
          return Math.min(retries * 100, 5000);
        },
      },
    });

    // Handle connection events
    redisClient.on('connect', () => {
      logger.info('Redis client connected');
    });

    redisClient.on('error', (err) => {
      logger.error(`Redis error: ${err}`);
    });

    redisClient.on('reconnecting', () => {
      logger.info('Reconnecting to Redis...');
    });

    await redisClient.connect();

    // Promisify Redis methods
    getAsync = promisify(redisClient.get).bind(redisClient);
    setAsync = promisify(redisClient.set).bind(redisClient);
    delAsync = promisify(redisClient.del).bind(redisClient);
    keysAsync = promisify(redisClient.keys).bind(redisClient);

    logger.info('Redis client initialized successfully');
  } catch (error) {
    logger.error(`Failed to initialize Redis: ${error.message}`);
    // Don't throw error to allow the app to run without Redis
  }
};

// Middleware to cache responses
const cache = (key, ttl = 3600) => {
  return async (req, res, next) => {
    if (!redisClient || !redisClient.isReady) {
      return next();
    }

    const cacheKey = typeof key === 'function' ? key(req) : key;
    
    try {
      const cachedData = await getAsync(cacheKey);
      
      if (cachedData) {
        logger.debug(`Cache hit for key: ${cacheKey}`);
        return res.json(JSON.parse(cachedData));
      }
      
      // Override res.json to cache the response
      const originalJson = res.json;
      res.json = (body) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const cacheValue = JSON.stringify(body);
          redisClient.set(cacheKey, cacheValue, 'EX', ttl).catch(err => {
            logger.error(`Error setting cache for key ${cacheKey}:`, err);
          });
        }
        originalJson.call(res, body);
      };
      
      next();
    } catch (error) {
      logger.error(`Cache middleware error: ${error.message}`);
      next();
    }
  };
};

// Invalidate cache by key pattern
const invalidateCache = async (keyPattern) => {
  if (!redisClient || !redisClient.isReady) return 0;
  
  try {
    const keys = await keysAsync(keyPattern);
    
    if (keys.length === 0) return 0;
    
    const result = await Promise.all(keys.map(key => delAsync(key)));
    logger.debug(`Invalidated ${result.length} cache entries for pattern: ${keyPattern}`);
    
    return result.length;
  } catch (error) {
    logger.error(`Error invalidating cache for pattern ${keyPattern}:`, error);
    return 0;
  }
};

// Clear all cache (use with caution)
const clearAllCache = async () => {
  if (!redisClient || !redisClient.isReady) return false;
  
  try {
    await redisClient.flushAll();
    logger.info('Cleared all cache');
    return true;
  } catch (error) {
    logger.error('Error clearing all cache:', error);
    return false;
  }
};

// Get cache statistics
const getCacheStats = async () => {
  if (!redisClient || !redisClient.isReady) {
    return { status: 'disabled' };
  }
  
  try {
    const info = await redisClient.info();
    const stats = {
      status: 'enabled',
      connected_clients: 0,
      used_memory_human: '0K',
      total_connections_received: 0,
      total_commands_processed: 0,
      keyspace_hits: 0,
      keyspace_misses: 0,
      uptime_in_seconds: 0,
    };
    
    // Parse Redis INFO command output
    info.split('\r\n').forEach(line => {
      const [key, value] = line.split(':');
      if (stats.hasOwnProperty(key)) {
        stats[key] = isNaN(Number(value)) ? value : Number(value);
      }
    });
    
    // Get all keys count
    try {
      const allKeys = await keysAsync('*');
      stats.total_keys = allKeys.length;
    } catch (err) {
      logger.error('Error getting total keys count:', err);
    }
    
    return stats;
  } catch (error) {
    logger.error('Error getting cache stats:', error);
    return { status: 'error', message: error.message };
  }
};

// Close Redis connection
const closeRedis = async () => {
  if (redisClient && redisClient.isReady) {
    await redisClient.quit();
    logger.info('Redis connection closed');
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  await closeRedis();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeRedis();
  process.exit(0);
});

module.exports = {
  initializeRedis,
  cache,
  invalidateCache,
  clearAllCache,
  getCacheStats,
  closeRedis,
  client: redisClient,
};
