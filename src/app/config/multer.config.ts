import multer from 'multer';
import { cloudinaryUpload } from './cloudinary.config';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const removeExtension = (filename: string) => {
  return filename.split('.').slice(0, -1).join('.');
};

// Storage for images (thumbnails, etc.)
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    folder: 'lms/images',
    public_id: (_req: any, file: Express.Multer.File) =>
      Math.random().toString(36).substring(2) +
      '-' +
      Date.now() +
      '-' +
      file.fieldname +
      '-' +
      removeExtension(file.originalname),
  } as any,
});

// Storage for documents (PDFs)
const documentStorage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    folder: 'lms/documents',
    resource_type: 'raw',
    public_id: (_req: any, file: Express.Multer.File) =>
      Math.random().toString(36).substring(2) +
      '-' +
      Date.now() +
      '-' +
      file.fieldname +
      '-' +
      removeExtension(file.originalname),
  } as any,
});

// Storage for videos
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    folder: 'lms/videos',
    resource_type: 'video',
    public_id: (_req: any, file: Express.Multer.File) =>
      Math.random().toString(36).substring(2) +
      '-' +
      Date.now() +
      '-' +
      file.fieldname +
      '-' +
      removeExtension(file.originalname),
  } as any,
});

// File filter function
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.fieldname === 'thumbnail' || file.fieldname === 'coverImage') {
    // Images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for thumbnails'));
    }
  } else if (file.fieldname === 'pdfNotes') {
    // PDFs
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for notes'));
    }
  } else if (file.fieldname === 'videoFile') {
    // Videos
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  } else {
    cb(null, true);
  }
};

export const multerUpload = multer({ 
  storage: imageStorage,
  fileFilter: fileFilter 
});

export const multerDocumentUpload = multer({ 
  storage: documentStorage,
  fileFilter: fileFilter 
});

export const multerVideoUpload = multer({ 
  storage: videoStorage,
  fileFilter: fileFilter 
});

// Custom multer for mixed file types
export const multerMixedUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter
});