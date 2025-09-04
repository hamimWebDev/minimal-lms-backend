import express from 'express';
import { ModuleControllers } from './module.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { moduleValidation } from './module.validation';


const router = express.Router();

// Admin routes (require admin/superAdmin role)
router.post(
  '/',
  validateRequest(moduleValidation.createModule),
  auth(['admin']),
  ModuleControllers.createModule
);

router.put(
  '/:id',
  validateRequest(moduleValidation.updateModule),
  auth(['admin']),
  ModuleControllers.updateModule
);

router.delete(
  '/:id',
  auth(['admin']),
  ModuleControllers.deleteModule
);

router.put(
  '/reorder/:courseId', 
  validateRequest(moduleValidation.reorderModules),
  auth(['admin']),
  ModuleControllers.reorderModules
);

// Public routes
router.get('/', ModuleControllers.getAllModules);
router.get('/course/:courseId', ModuleControllers.getModulesByCourse);
router.get('/:id', ModuleControllers.getModuleById);

export const ModuleRoutes = router;
