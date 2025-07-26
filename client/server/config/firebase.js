const admin = require('firebase-admin');
const logger = require('../utils/logger');

let db, auth, storage, firebaseApp;

const initializeFirebase = () => {
  // Validate required environment variables
  const requiredEnvVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    logger.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
  }

  // Trim quotes from env vars
  const projectId = process.env.FIREBASE_PROJECT_ID.trim().replace(/^"|"$/g, '');
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL.trim().replace(/^"|"$/g, '');
  const privateKey = process.env.FIREBASE_PRIVATE_KEY.trim().replace(/^"|"$/g, '').replace(/\\n/g, '\n');

  // Initialize Firebase Admin SDK
  const firebaseConfig = {
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
    databaseURL: `https://${projectId}.firebaseio.com`,
    storageBucket: `${projectId}.appspot.com`
  };

  if (!admin.apps.length) {
    admin.initializeApp(firebaseConfig);
    logger.info('Firebase Admin SDK initialized successfully');
  } else {
    admin.app(); // Get the default app if it already exists
  }

  db = admin.firestore();
  auth = admin.auth();
  storage = admin.storage();
  firebaseApp = admin.app();

  // Verify Firebase connection
  db.listCollections()
    .then(() => logger.info('Successfully connected to Firestore'))
    .catch(err => {
      logger.error('Failed to connect to Firestore:', err);
      process.exit(1);
    });
};

module.exports = {
  initializeFirebase,
  get db() {
    if (!db) {
      throw new Error('Firestore has not been initialized. Call initializeFirebase() first.');
    }
    return db;
  },
  get auth() {
    if (!auth) {
      throw new Error('Firebase Auth has not been initialized. Call initializeFirebase() first.');
    }
    return auth;
  },
  get storage() {
    if (!storage) {
      throw new Error('Firebase Storage has not been initialized. Call initializeFirebase() first.');
    }
    return storage;
  }
};