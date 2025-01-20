import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/env.js";

export const generateToken = (userInfo) => {
	const token = jwt.sign(userInfo, jwtSecret, { expiresIn: "1h" });
	return token;
}