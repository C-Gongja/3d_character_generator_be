import express from "express";
import { signUpController, loginController, refreshTokenController } from "../../controllers/auth/authController.js"
import validateUser from "../../middleware/inputValidator.js";

const router = express.Router();

// Sign up route
router.post("/signup", validateUser, signUpController);
// Login route
router.post("/login", loginController);
router.post("/refresh", refreshTokenController);

export default router;