"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const progress_controller_1 = require("./progress.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const progress_validation_1 = require("./progress.validation");
const router = express_1.default.Router();
// User routes
router.post('/course/:courseId', (0, auth_1.default)(['user', 'admin', 'superAdmin']), progress_controller_1.ProgressControllers.createOrUpdateProgress);
router.post('/course/:courseId/unlock/:lectureId', (0, validateRequest_1.default)(progress_validation_1.progressValidation.unlockLecture), (0, auth_1.default)(['user', 'admin', 'superAdmin']), progress_controller_1.ProgressControllers.unlockLecture);
router.post('/course/:courseId/complete/:lectureId', (0, validateRequest_1.default)(progress_validation_1.progressValidation.markLectureCompleted), (0, auth_1.default)(['user', 'admin', 'superAdmin']), progress_controller_1.ProgressControllers.markLectureCompleted);
router.get('/course/:courseId', (0, validateRequest_1.default)(progress_validation_1.progressValidation.getProgress), (0, auth_1.default)(['user', 'admin', 'superAdmin']), progress_controller_1.ProgressControllers.getCourseProgress);
router.get('/user/:userId?', (0, validateRequest_1.default)(progress_validation_1.progressValidation.getUserProgress), (0, auth_1.default)(['user', 'admin', 'superAdmin']), progress_controller_1.ProgressControllers.getUserProgress);
router.get('/stats/:userId?', (0, validateRequest_1.default)(progress_validation_1.progressValidation.getUserProgress), (0, auth_1.default)(['user', 'admin', 'superAdmin']), progress_controller_1.ProgressControllers.getProgressStats);
// Admin routes
router.get('/all', (0, auth_1.default)(['admin', 'superAdmin']), progress_controller_1.ProgressControllers.getAllUsersProgress);
router.delete('/:id', (0, auth_1.default)(['user', 'admin', 'superAdmin']), progress_controller_1.ProgressControllers.deleteProgress);
exports.default = router;
