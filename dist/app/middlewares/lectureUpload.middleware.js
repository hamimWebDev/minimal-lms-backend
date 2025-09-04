"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processLectureFiles = exports.lectureUploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_config_1 = require("../config/cloudinary.config");
const AppError_1 = __importDefault(require("../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
// File filter function
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'videoFile') {
        // Videos
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only video files are allowed'));
        }
    }
    else if (file.fieldname === 'pdfNotes') {
        // PDFs
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        }
        else {
            cb(new Error('Only PDF files are allowed for notes'));
        }
    }
    else {
        cb(null, true);
    }
};
// Memory storage for processing files
const memoryStorage = multer_1.default.memoryStorage();
// Multer instance with memory storage
const upload = (0, multer_1.default)({
    storage: memoryStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
    }
});
// Custom middleware for lecture file uploads
exports.lectureUploadMiddleware = upload.fields([
    { name: 'videoFile', maxCount: 1 },
    { name: 'pdfNotes', maxCount: 10 }
]);
// Process uploaded files and upload to Cloudinary
const processLectureFiles = async (req, res, next) => {
    try {
        if (!req.files) {
            req.body.pdfNotes = [];
            return next();
        }
        const files = req.files;
        const uploadedFiles = {};
        // Process video file
        if (files.videoFile) {
            const videoFile = files.videoFile[0];
            const result = await cloudinary_config_1.cloudinaryUpload.uploader.upload(`data:${videoFile.mimetype};base64,${videoFile.buffer.toString('base64')}`, {
                folder: 'lms/videos',
                resource_type: 'video',
                public_id: `video-${Date.now()}-${Math.random().toString(36).substring(2)}`,
            });
            uploadedFiles.videoFile = result.secure_url;
        }
        // Process PDF files
        if (files.pdfNotes) {
            const pdfUrls = [];
            for (const pdfFile of files.pdfNotes) {
                const result = await cloudinary_config_1.cloudinaryUpload.uploader.upload(`data:${pdfFile.mimetype};base64,${pdfFile.buffer.toString('base64')}`, {
                    folder: 'lms/documents',
                    resource_type: 'raw',
                    public_id: `pdf-${Date.now()}-${Math.random().toString(36).substring(2)}`,
                });
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
    }
    catch (error) {
        next(new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Error uploading files'));
    }
};
exports.processLectureFiles = processLectureFiles;
