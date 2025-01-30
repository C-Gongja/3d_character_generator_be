import jwt from "jsonwebtoken";
import { jwtSecret, jwtExpTime } from "../config/env.js";

export const generateToken = (userInfo) => {
	const accessToken = jwt.sign(userInfo, jwtSecret, { expiresIn: jwtExpTime });
	const refreshToken = jwt.sign(userInfo, jwtSecret, { expiresIn: '' });

	return { accessToken, refreshToken };
}