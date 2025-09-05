"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const courseProgress_controller_1 = require("./courseProgress.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const courseProgress_validation_1 = require("./courseProgress.validation");
const router = express_1.default.Router();
// User routes
router.post('/unlock-lecture', (0, validateRequest_1.default)(courseProgress_validation_1.courseProgressValidation.unlockLecture), (0, auth_1.default)(['user', 'admin', 'superAdmin']), courseProgress_controller_1.CourseProgressControllers.unlockLecture);
router.post('/mark-completed', (0, validateRequest_1.default)(courseProgress_validation_1.courseProgressValidation.markLectureCompleted), (0, auth_1.default)(['user', 'admin', 'superAdmin']), courseProgress_controller_1.CourseProgressControllers.markLectureCompleted);
router.get('/course/:courseId', (0, validateRequest_1.default)(courseProgress_validation_1.courseProgressValidation.getProgress), (0, auth_1.default)(['user', 'admin', 'superAdmin']), courseProgress_controller_1.CourseProgressControllers.getCourseProgress);
// Admin routes
router.get('/admin/all', (0, validateRequest_1.default)(courseProgress_validation_1.courseProgressValidation.getAllProgress), (0, auth_1.default)(['admin', 'superAdmin']), courseProgress_controller_1.CourseProgressControllers.getAllCourseProgress);
router.get('/admin/course/:courseId/overview', (0, validateRequest_1.default)(courseProgress_validation_1.courseProgressValidation.getProgress), (0, auth_1.default)(['admin', 'superAdmin']), courseProgress_controller_1.CourseProgressControllers.getAdminProgressOverview);
exports.default = router;
