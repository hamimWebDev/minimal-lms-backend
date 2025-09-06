"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadRoutes = void 0;
const express_1 = __importDefault(require("express"));
const upload_controller_1 = require("./upload.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const zod_1 = require("zod");
const router = express_1.default.Router();
// Validation schema for signature generation
const generateSignatureValidation = zod_1.z.object({
    body: zod_1.z.object({
        folder: zod_1.z.string().min(1, 'Folder is required'),
        resource_type: zod_1.z.string().min(1, 'Resource type is required'),
        timestamp: zod_1.z.number().min(1, 'Timestamp is required'),
    }),
});
// Admin routes (require admin/superAdmin role)
router.post('/signature', (0, validateRequest_1.default)(generateSignatureValidation), (0, auth_1.default)(['admin']), upload_controller_1.UploadControllers.generateUploadSignature);
// Test endpoint (no auth required for testing)
router.get('/test-signature', upload_controller_1.UploadControllers.testSignature);
exports.UploadRoutes = router;
