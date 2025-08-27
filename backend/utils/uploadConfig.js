// utils/uploadConfig.js
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 120000 // 60 seconds timeout
});

// Profile picture storage configuration
const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'svg'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

// Booking images storage configuration
const bookingStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'bookings',
    allowed_formats: ['jpg', 'jpeg', 'png', 'svg'],
    transformation: [{ width: 1024, height: 1024, crop: 'limit' }]
  }
});

// Service images storage configuration
const serviceStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'services',
    allowed_formats: ['jpg', 'jpeg', 'png', 'svg'],
    transformation: [{ width: 1024, height: 1024, crop: 'limit' }]
  }
});

const reviewStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'reviews',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 1024, height: 1024, crop: 'limit' }],
    resource_type: 'auto',
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  console.log('Processing file:', file.originalname);
  
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return cb(new Error('Only jpg, jpeg, and png files are allowed!'), false);
  }
  
  if (file.size > 10 * 1024 * 1024) {
    return cb(new Error('File size too large! Max 10MB allowed.'), false);
  }
  
  cb(null, true);
};

// Export different upload configurations
const profileUpload = multer({
  storage: profileStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const bookingUpload = multer({
  storage: bookingStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

const serviceUpload = multer({
  storage: serviceStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

const reviewUpload = multer({
  storage: reviewStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5
  }
});

module.exports = {
  profileUpload,
  bookingUpload,
  serviceUpload,
  reviewUpload,
  cloudinary
};