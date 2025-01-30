import express from "express";
import { signUpController, loginController, refreshTokenController } from "../../controllers/auth/authController.js"
import { verifyToken } from "../../middleware/authentication.js";
import validateUser from "../../middleware/inputValidator.js";

const router = express.Router();

// Sign up route
router.post("/signup", validateUser, signUpController);
// Login route
router.post("/login", loginController);
router.post("/refresh", refreshTokenController);
// Protected route (example)
router.get("/profile", verifyToken, (req, res) => {
	res.status(200).json({ message: "This is a protected profile route." });
});

export default router;