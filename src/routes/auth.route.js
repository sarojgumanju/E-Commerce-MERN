import express from "express";
import authController from "../controllers/auth.controller.js";
import validate from "../middlewares/validator.js";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from "../libs/schemas/auth.schema.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword);
export default router; 