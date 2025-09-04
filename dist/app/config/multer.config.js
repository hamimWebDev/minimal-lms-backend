"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerMixedUpload = exports.multerVideoUpload = exports.multerDocumentUpload = exports.multerUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_config_1 = require("./cloudinary.config");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const removeExtension = (filename) => {
    return filename.split('.').slice(0, -1).join('.');
};
// Storage for images (thumbnails, etc.)
const imageStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_config_1.cloudinaryUpload,
    params: {
        folder: 'lms/images',
        public_id: (_req, file) => Math.random().toString(36).substring(2) +
            '-' +
            Date.now() +
            '-' +
            file.fieldname +
            '-' +
            removeExtension(file.originalname),
    },
});
// Storage for documents (PDFs)
const documentStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_config_1.cloudinaryUpload,
    params: {
        folder: 'lms/documents',
        resource_type: 'raw',
        public_id: (_req, file) => Math.random().toString(36).substring(2) +
            '-' +
            Date.now() +
            '-' +
            file.fieldname +
            '-' +
            removeExtension(file.originalname),
    },
});
// Storage for videos
const videoStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_config_1.cloudinaryUpload,
    params: {
        folder: 'lms/videos',
        resource_type: 'video',
        public_id: (_req, file) => Math.random().toString(36).substring(2) +
            '-' +
            Date.now() +
            '-' +
            file.fieldname +
            '-' +
            removeExtension(file.originalname),
    },
});
// File filter function
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'thumbnail' || file.fieldname === 'coverImage') {
        // Images
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed for thumbnails'));
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
    else if (file.fieldname === 'videoFile') {
        // Videos
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only video files are allowed'));
        }
    }
    else {
        cb(null, true);
    }
};
exports.multerUpload = (0, multer_1.default)({
    storage: imageStorage,
    fileFilter: fileFilter
});
exports.multerDocumentUpload = (0, multer_1.default)({
    storage: documentStorage,
    fileFilter: fileFilter
});
exports.multerVideoUpload = (0, multer_1.default)({
    storage: videoStorage,
    fileFilter: fileFilter
});
// Custom multer for mixed file types
exports.multerMixedUpload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    fileFilter: fileFilter
});
