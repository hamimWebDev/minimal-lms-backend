import { Router } from "express";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/auth";
// import validateRequest from "../../middlewares/validateRequest";
// import { AuthValidation } from "./auth.validation";

const router = Router();

router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/logout', AuthController.logout);
router.post('/logout-all', auth(['admin', 'user', 'superAdmin']), AuthController.logoutAll);

export const AuthRoutes = router;
