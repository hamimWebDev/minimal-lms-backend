"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const course_controller_1 = require("./course.controller");
const multer_config_1 = require("../../config/multer.config");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const course_validation_1 = require("./course.validation");
const router = express_1.default.Router();
// Admin routes (require admin/superAdmin role)
router.post('/', multer_config_1.multerUpload.single('thumbnail'), (req, res, next) => {
    if (!req.file) {
        req.body.thumbnail = req.body.thumbnail || '';
    }
    else {
        req.body.thumbnail = req.file.path;
    }
    next();
}, (0, validateRequest_1.default)(course_validation_1.courseValidation.createCourse), (0, auth_1.default)(['admin']), course_controller_1.CourseControllers.createCourse);
router.put('/:id', multer_config_1.multerUpload.single('thumbnail'), (req, res, next) => {
    if (req.file) {
        req.body.thumbnail = req.file.path;
    }
    next();
}, (0, validateRequest_1.default)(course_validation_1.courseValidation.updateCourse), (0, auth_1.default)(['admin']), course_controller_1.CourseControllers.updateCourse);
router.delete('/:id', (0, auth_1.default)(['admin']), course_controller_1.CourseControllers.deleteCourse);
// Public routes
router.get('/', course_controller_1.CourseControllers.getAllCourses);
router.get('/published', course_controller_1.CourseControllers.getPublishedCourses);
router.get('/:id', course_controller_1.CourseControllers.getCourseById);
// User routes (require authentication)
router.get('/:id/access', (0, auth_1.default)(['user', 'admin', 'superAdmin']), course_controller_1.CourseControllers.checkCourseAccess);
exports.CourseRoutes = router;
