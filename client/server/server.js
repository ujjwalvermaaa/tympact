require('module-alias/register');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const mongoose = require('mongoose');
const http = require('http');
const socketio = require('socket.io');
const app = require('./app');
const logger = require('./utils/logger');
const { initializeFirebase } = require('./config/firebase');

// Initialize Firebase
initializeFirebase();

// Connect to MongoDB (optional - Firebase is primary)
const DB = process.env.MONGODB_URI;

if (DB) {
  mongoose
    .connect(DB, {})
    .then(() => {
      logger.info('MongoDB connection successful!');
    })
    .catch((err) => {
      logger.warn('MongoDB connection failed, using Firebase only:', err.message);
    });
} else {
  logger.info('MongoDB not configured, using Firebase as primary database');
}

// Create HTTP server and initialize Socket.IO
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket.IO connection handler
require('./services/socket')(io);

// Start server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  logger.info(`App running on port ${port}...`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err.name, err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err.name, err);
  process.exit(1);
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    logger.info('💥 Process terminated!');
  });
});
