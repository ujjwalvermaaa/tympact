const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const AppError = require('../utils/appError');
const logger = require('../utils/logger');

// Configure multer for memory storage
const multerStorage = multer.memoryStorage();

// File filter to accept only images
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

// Configure multer upload
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Middleware for single image upload
const uploadUserPhoto = upload.single('photo');

// Middleware for multiple task attachments
const uploadTaskAttachments = upload.fields([
  { name: 'attachments', maxCount: 5 },
  { name: 'coverImage', maxCount: 1 },
]);

// Process uploaded images (resize, format, optimize)
const processImage = async (file, options = {}) => {
  try {
    const sharp = require('sharp');
    
    // Default options
    const defaultOptions = {
      width: 800,
      height: 800,
      quality: 80,
      format: 'jpeg',
      fit: 'cover',
      ...options,
    };
    
    // Process image
    const processedImage = await sharp(file.buffer)
      .resize(defaultOptions.width, defaultOptions.height, {
        fit: defaultOptions.fit,
        position: 'center',
      })
      .toFormat(defaultOptions.format, {
        quality: defaultOptions.quality,
        progressive: true,
      })
      .toBuffer();
    
    return {
      buffer: processedImage,
      mimetype: `image/${defaultOptions.format}`,
      originalname: `${uuidv4()}.${defaultOptions.format}`,
    };
  } catch (error) {
    logger.error('Error processing image:', error);
    throw new AppError('Error processing image', 500);
  }
};

// Middleware to process profile photo
const processProfilePhoto = async (req, res, next) => {
  try {
    if (!req.file) return next();
    
    // Process the image
    const processedImage = await processImage(req.file, {
      width: 500,
      height: 500,
      format: 'jpeg',
      quality: 90,
    });
    
    // Replace the original file with the processed one
    req.file = {
      ...req.file,
      buffer: processedImage.buffer,
      mimetype: processedImage.mimetype,
      originalname: `profile-${Date.now()}.jpeg`,
    };
    
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to process task attachments
const processTaskAttachments = async (req, res, next) => {
  try {
    if (!req.files) return next();
    
    const processedFiles = [];
    
    // Process cover image if exists
    if (req.files.coverImage) {
      const coverImage = await processImage(req.files.coverImage[0], {
        width: 1200,
        height: 630,
        format: 'jpeg',
        quality: 85,
      });
      
      processedFiles.push({
        fieldname: 'coverImage',
        file: {
          ...req.files.coverImage[0],
          buffer: coverImage.buffer,
          mimetype: coverImage.mimetype,
          originalname: `cover-${Date.now()}.jpeg`,
        },
      });
    }
    
    // Process attachments if they exist
    if (req.files.attachments) {
      const attachmentPromises = req.files.attachments.map(async (file) => {
        // Check if file is an image
        if (file.mimetype.startsWith('image')) {
          const processedImage = await processImage(file, {
            width: 1200,
            height: 1200,
            format: 'jpeg',
            quality: 85,
          });
          
          return {
            ...file,
            buffer: processedImage.buffer,
            mimetype: processedImage.mimetype,
            originalname: `task-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpeg`,
          };
        }
        
        // For non-image files, just return as is (with size limit check)
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          throw new AppError('File size exceeds 10MB limit', 400);
        }
        
        return file;
      });
      
      const processedAttachments = await Promise.all(attachmentPromises);
      
      processedFiles.push({
        fieldname: 'attachments',
        files: processedAttachments,
      });
    }
    
    // Replace the original files with processed ones
    req.files = processedFiles.reduce((acc, item) => {
      if (item.fieldname === 'coverImage') {
        acc.coverImage = [item.file];
      } else {
        acc.attachments = item.files;
      }
      return acc;
    }, {});
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadUserPhoto,
  uploadTaskAttachments,
  processProfilePhoto,
  processTaskAttachments,
};
