"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LectureRoutes = void 0;
const express_1 = __importDefault(require("express"));
const lecture_controller_1 = require("./lecture.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const lecture_validation_1 = require("./lecture.validation");
const router = express_1.default.Router();
// Admin routes (require admin/superAdmin role)
router.post('/', (0, validateRequest_1.default)(lecture_validation_1.lectureValidation.createLecture), (0, auth_1.default)(['admin']), lecture_controller_1.LectureControllers.createLecture);
router.put('/:id', (0, validateRequest_1.default)(lecture_validation_1.lectureValidation.updateLecture), (0, auth_1.default)(['admin']), lecture_controller_1.LectureControllers.updateLecture);
router.delete('/:id', (0, auth_1.default)(['admin']), lecture_controller_1.LectureControllers.deleteLecture);
router.put('/reorder/:moduleId', (0, validateRequest_1.default)(lecture_validation_1.lectureValidation.reorderLectures), (0, auth_1.default)(['admin']), lecture_controller_1.LectureControllers.reorderLectures);
// Public routes
router.get('/', lecture_controller_1.LectureControllers.getAllLectures);
router.get('/module/:moduleId', lecture_controller_1.LectureControllers.getLecturesByModule);
router.get('/course/:courseId', lecture_controller_1.LectureControllers.getLecturesByCourse);
router.get('/:id', lecture_controller_1.LectureControllers.getLectureById);
exports.LectureRoutes = router;
