"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleRoutes = void 0;
const express_1 = __importDefault(require("express"));
const module_controller_1 = require("./module.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const module_validation_1 = require("./module.validation");
const router = express_1.default.Router();
// Admin routes (require admin/superAdmin role)
router.post('/', (0, validateRequest_1.default)(module_validation_1.moduleValidation.createModule), (0, auth_1.default)(['admin']), module_controller_1.ModuleControllers.createModule);
router.put('/:id', (0, validateRequest_1.default)(module_validation_1.moduleValidation.updateModule), (0, auth_1.default)(['admin']), module_controller_1.ModuleControllers.updateModule);
router.delete('/:id', (0, auth_1.default)(['admin']), module_controller_1.ModuleControllers.deleteModule);
router.put('/reorder/:courseId', (0, validateRequest_1.default)(module_validation_1.moduleValidation.reorderModules), (0, auth_1.default)(['admin']), module_controller_1.ModuleControllers.reorderModules);
// Public routes
router.get('/', module_controller_1.ModuleControllers.getAllModules);
router.get('/course/:courseId', module_controller_1.ModuleControllers.getModulesByCourse);
router.get('/:id', module_controller_1.ModuleControllers.getModuleById);
exports.ModuleRoutes = router;
