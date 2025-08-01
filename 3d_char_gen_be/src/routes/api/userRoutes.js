import express from "express";
import {
	createUser,
	deleteUser,
	getAllUsers,
	getUserById,
	updateUser,
	getUserCustomById,
	createUserCustom,
	updateUserCustom
}
	from "../../controllers/user/userController.js";
import validateUser from "../../middleware/inputValidator.js";
import { verifyToken } from "../../middleware/authentication.js";

const router = express.Router();

router.post("/user", validateUser, createUser);
router.get("/users", getAllUsers);

router.get("/user", verifyToken, getUserById);
router.put("/user", validateUser, updateUser);

// to get other's info 
// router.get("/user/:id", verifyToken, getUserById);
// router.put("/user/:id", validateUser, updateUser);

router.post("/usercustom/:id", createUserCustom);
router.get("/usercustom/:id", getUserCustomById);
router.patch("/usercustom/:id", updateUserCustom);

router.delete("/user", deleteUser);

export default router;