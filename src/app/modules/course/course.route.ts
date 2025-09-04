import express from 'express';
import { CourseControllers } from './course.controller';
import { multerUpload } from '../../config/multer.config';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { courseValidation } from './course.validation';

const router = express.Router();

// Admin routes (require admin/superAdmin role)
router.post(
  '/',
  multerUpload.single('thumbnail'),
  (req, res, next) => {
    if (!req.file) {
      req.body.thumbnail = req.body.thumbnail || '';
    } else {
      req.body.thumbnail = req.file.path;
    }
    next();
  },
  validateRequest(courseValidation.createCourse),
  auth(['admin']),
  CourseControllers.createCourse
);

router.put(
  '/:id',
  multerUpload.single('thumbnail'),
  (req, res, next) => {
    if (req.file) {
      req.body.thumbnail = req.file.path;
    }
    next();
  },
  validateRequest(courseValidation.updateCourse),
  auth(['admin']),
  CourseControllers.updateCourse
);

router.delete(
  '/:id',
  auth(['admin']),
  CourseControllers.deleteCourse
);

// Public routes
router.get('/', CourseControllers.getAllCourses);
router.get('/published', CourseControllers.getPublishedCourses);
router.get('/:id', CourseControllers.getCourseById);

// User routes (require authentication)
router.get(
  '/:id/access',
  auth(['user', 'admin', 'superAdmin']),
  CourseControllers.checkCourseAccess
);

export const CourseRoutes = router;
