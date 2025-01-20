import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/env.js";

export const verifyToken = (req, res, next) => {
	let token;
	let authHeader = req.headers.Authorization || req.headers.authorization;
	if (authHeader && authHeader.startsWith("Bearer")) {
		token = authHeader.split(" ")[1];

		if (!token) {
			return res.status(401).json({
				status: 401,
				message: "no token, auth denied",
			});
		}

		try {
			const decoded = jwt.verify(token, jwtSecret);
			req.user = decoded;
			next();
		} catch (error) {
			res.status(400).json({
				status: 400,
				message: "token is not valid",
			});
		}
	} else {
		return res.status(401).json({
			status: 401,
			message: "no token, auth denied",
		});
	}
};