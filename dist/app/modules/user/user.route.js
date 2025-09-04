"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
// Route to create a regular user
router.post('/create-user', user_controller_1.UserController.createUser);
router.patch('/user/:id', (0, auth_1.default)(['admin']), user_controller_1.UserController.updateUser);
router.get('/all-admin', (0, auth_1.default)(['admin']), user_controller_1.UserController.getAllAdmin);
router.get('/all-admin', (0, auth_1.default)(['admin']), user_controller_1.UserController.getAllAdmin);
router.get('/all-user', (0, auth_1.default)(['admin']), user_controller_1.UserController.getAllUser);
router.get('/:id', user_controller_1.UserController.getSingleUser);
router.get('/admin/:id', user_controller_1.UserController.getSingleAdmin);
router.patch('/:id', (0, auth_1.default)(['admin']), user_controller_1.UserController.changeUserRole);
router.patch('/status/:id', (0, auth_1.default)(['admin']), user_controller_1.UserController.changeUserStatus);
router.delete('/:id', (0, auth_1.default)(['admin']), user_controller_1.UserController.deleteUser);
router.delete('/admin/:id', (0, auth_1.default)(['admin']), user_controller_1.UserController.deleteAdmin);
exports.UserRoutes = router;
