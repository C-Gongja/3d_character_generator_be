import jwt from "jsonwebtoken";
import { jwtSecret, jwtAccExpTime, jwtRefExpTime } from "../config/env.js";

export const generateToken = (userInfo) => {
	try {
		const accessToken = jwt.sign(userInfo, jwtSecret, { expiresIn: jwtAccExpTime });
		const refreshToken = jwt.sign(userInfo, jwtSecret, { expiresIn: jwtRefExpTime });

		return { accessToken, refreshToken };
	} catch (error) {
		console.log("failed generate token: ", error);
		throw error;
	}
}