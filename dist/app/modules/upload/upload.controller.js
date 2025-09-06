"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadControllers = void 0;
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const crypto_1 = __importDefault(require("crypto"));
// Generate Cloudinary signature
const generateSignature = (params) => {
    // Create parameters object and sort keys for consistent ordering
    const sortedParams = {};
    sortedParams.folder = params.folder;
    sortedParams.resource_type = params.resource_type;
    sortedParams.timestamp = params.timestamp.toString();
    // Create string to sign with sorted parameters
    const stringToSign = Object.keys(sortedParams)
        .sort()
        .map(key => `${key}=${sortedParams[key]}`)
        .join('&');
    const signatureString = stringToSign + process.env.CLOUDINARY_API_SECRET;
    // Debug logging
    console.log('Signature generation debug:');
    console.log('Parameters:', params);
    console.log('Sorted parameters:', sortedParams);
    console.log('String to sign:', stringToSign);
    console.log('API Secret exists:', !!process.env.CLOUDINARY_API_SECRET);
    console.log('Generated signature:', crypto_1.default.createHash('sha1').update(signatureString).digest('hex'));
    return crypto_1.default.createHash('sha1').update(signatureString).digest('hex');
};
const generateUploadSignature = (0, catchAsync_1.default)(async (req, res, next) => {
    const { folder, resource_type, timestamp } = req.body;
    if (!folder || !resource_type || !timestamp) {
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: 'Missing required parameters: folder, resource_type, timestamp',
            data: null,
        });
        return;
    }
    const signature = generateSignature({
        folder,
        resource_type,
        timestamp,
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Signature generated successfully',
        data: {
            signature,
            api_key: process.env.CLOUDINARY_API_KEY,
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            debug: {
                stringToSign: `folder=${folder}&resource_type=${resource_type}&timestamp=${timestamp}`,
                parameters: { folder, resource_type, timestamp }
            }
        },
    });
});
// Test signature generation
const testSignature = (0, catchAsync_1.default)(async (req, res, next) => {
    const testParams = {
        folder: 'lms/documents',
        resource_type: 'raw',
        timestamp: Math.round(new Date().getTime() / 1000),
    };
    const signature = generateSignature(testParams);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Test signature generated',
        data: {
            signature,
            api_key: process.env.CLOUDINARY_API_KEY,
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            testParams,
            stringToSign: `folder=${testParams.folder}&resource_type=${testParams.resource_type}&timestamp=${testParams.timestamp}`,
        },
    });
});
exports.UploadControllers = {
    generateUploadSignature,
    testSignature,
};
