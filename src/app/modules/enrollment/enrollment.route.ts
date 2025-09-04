import express from 'express';
import { EnrollmentControllers } from './enrollment.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { enrollmentValidation } from './enrollment.validation';

const router = express.Router();

// User routes
router.post(
  '/',
  validateRequest(enrollmentValidation.createEnrollmentRequest),
  auth(['user', 'admin', 'superAdmin']),
  EnrollmentControllers.createEnrollmentRequest
);

router.get(
  '/my-requests',
  validateRequest(enrollmentValidation.getEnrollmentRequests),
  auth(['user', 'admin', 'superAdmin']),
  EnrollmentControllers.getEnrollmentRequestsByUser
);

router.get(
  '/status/:courseId',
  auth(['user', 'admin', 'superAdmin']),
  EnrollmentControllers.checkUserEnrollmentStatus
);

router.get(
  '/:id',
  auth(['user', 'admin', 'superAdmin']),
  EnrollmentControllers.getEnrollmentRequestById
);

router.delete(
  '/:id',
  auth(['user', 'admin', 'superAdmin']),
  EnrollmentControllers.deleteEnrollmentRequest
);

// Admin routes
router.get(
  '/',
  validateRequest(enrollmentValidation.getEnrollmentRequests),
  auth(['admin', 'superAdmin']),
  EnrollmentControllers.getAllEnrollmentRequests
);

router.patch(
  '/:id',
  validateRequest(enrollmentValidation.updateEnrollmentRequest),
  auth(['admin', 'superAdmin']),
  EnrollmentControllers.updateEnrollmentRequest
);

export const EnrollmentRoutes = router;
