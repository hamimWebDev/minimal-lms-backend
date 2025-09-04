"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const enrollment_controller_1 = require("./enrollment.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const enrollment_validation_1 = require("./enrollment.validation");
const router = express_1.default.Router();
// User routes
router.post('/', (0, validateRequest_1.default)(enrollment_validation_1.enrollmentValidation.createEnrollmentRequest), (0, auth_1.default)(['user', 'admin', 'superAdmin']), enrollment_controller_1.EnrollmentControllers.createEnrollmentRequest);
router.get('/my-requests', (0, validateRequest_1.default)(enrollment_validation_1.enrollmentValidation.getEnrollmentRequests), (0, auth_1.default)(['user', 'admin', 'superAdmin']), enrollment_controller_1.EnrollmentControllers.getEnrollmentRequestsByUser);
router.get('/status/:courseId', (0, auth_1.default)(['user', 'admin', 'superAdmin']), enrollment_controller_1.EnrollmentControllers.checkUserEnrollmentStatus);
router.get('/:id', (0, auth_1.default)(['user', 'admin', 'superAdmin']), enrollment_controller_1.EnrollmentControllers.getEnrollmentRequestById);
router.delete('/:id', (0, auth_1.default)(['user', 'admin', 'superAdmin']), enrollment_controller_1.EnrollmentControllers.deleteEnrollmentRequest);
// Admin routes
router.get('/', (0, validateRequest_1.default)(enrollment_validation_1.enrollmentValidation.getEnrollmentRequests), (0, auth_1.default)(['admin', 'superAdmin']), enrollment_controller_1.EnrollmentControllers.getAllEnrollmentRequests);
router.patch('/:id', (0, validateRequest_1.default)(enrollment_validation_1.enrollmentValidation.updateEnrollmentRequest), (0, auth_1.default)(['admin', 'superAdmin']), enrollment_controller_1.EnrollmentControllers.updateEnrollmentRequest);
exports.EnrollmentRoutes = router;
