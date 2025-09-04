import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { cloudinaryUpload } from '../config/cloudinary.config';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';

// File filter function
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.fieldname === 'videoFile') {
    // Videos
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  } else if (file.fieldname === 'pdfNotes') {
    // PDFs
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for notes'));
    }
  } else {
    cb(null, true);
  }
};

// Memory storage for processing files
const memoryStorage = multer.memoryStorage();

// Multer instance with memory storage
const upload = multer({
  storage: memoryStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  }
});

// Custom middleware for lecture file uploads
export const lectureUploadMiddleware = upload.fields([
  { name: 'videoFile', maxCount: 1 },
  { name: 'pdfNotes', maxCount: 10 }
]);

// Process uploaded files and upload to Cloudinary
export const processLectureFiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.files) {
      req.body.pdfNotes = [];
      return next();
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const uploadedFiles: { [key: string]: string | string[] } = {};

    // Process video file
    if (files.videoFile) {
      const videoFile = files.videoFile[0];
      const result = await cloudinaryUpload.uploader.upload(
        `data:${videoFile.mimetype};base64,${videoFile.buffer.toString('base64')}`,
        {
          folder: 'lms/videos',
          resource_type: 'video',
          public_id: `video-${Date.now()}-${Math.random().toString(36).substring(2)}`,
        }
      );
      uploadedFiles.videoFile = result.secure_url;
    }

    // Process PDF files
    if (files.pdfNotes) {
      const pdfUrls: string[] = [];
      for (const pdfFile of files.pdfNotes) {
        const result = await cloudinaryUpload.uploader.upload(
          `data:${pdfFile.mimetype};base64,${pdfFile.buffer.toString('base64')}`,
          {
            folder: 'lms/documents',
            resource_type: 'raw',
            public_id: `pdf-${Date.now()}-${Math.random().toString(36).substring(2)}`,
          }
        );
        pdfUrls.push(result.secure_url);
      }
      uploadedFiles.pdfNotes = pdfUrls;
    }

    // Update request body with uploaded file URLs
    req.body = {
      ...req.body,
      ...uploadedFiles,
    };

    // Ensure pdfNotes is always an array
    if (!req.body.pdfNotes) {
      req.body.pdfNotes = [];
    }

    next();
  } catch (error) {
    next(new AppError(httpStatus.BAD_REQUEST, 'Error uploading files'));
  }
};
