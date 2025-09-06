import express from 'express';
import { LectureControllers } from './lecture.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { lectureValidation } from './lecture.validation';


const router = express.Router();

// Admin routes (require admin/superAdmin role)
router.post(
  '/',
  validateRequest(lectureValidation.createLecture),
  auth(['admin']),
  LectureControllers.createLecture
);

router.put(
  '/:id',
  validateRequest(lectureValidation.updateLecture),
  auth(['admin']),
  LectureControllers.updateLecture
);

router.delete(
  '/:id',
  auth(['admin']),
  LectureControllers.deleteLecture
);

router.put(
  '/reorder/:moduleId',
  validateRequest(lectureValidation.reorderLectures),
  auth(['admin']),
  LectureControllers.reorderLectures
);

// Public routes
router.get('/', LectureControllers.getAllLectures);
router.get('/module/:moduleId', LectureControllers.getLecturesByModule);
router.get('/course/:courseId', LectureControllers.getLecturesByCourse);
router.get('/:id', LectureControllers.getLectureById);

export const LectureRoutes = router;
