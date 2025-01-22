import jwt from "jsonwebtoken";
import { jwtSecret, jwtExpTime } from "../config/env.js";

export const generateToken = (userInfo) => {
	const token = jwt.sign(userInfo, jwtSecret, { expiresIn: jwtExpTime });
	return token;
}