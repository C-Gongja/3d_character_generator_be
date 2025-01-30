import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/env.js";

export const verifyToken = (req, res, next) => {
	let token;
	let authHeader = req.headers.Authorization || req.headers.authorization;
	let refreshTokenHeader = req.headers.refreshToken;

	console.log("accessTokenH header: ", authHeader);
	console.log("refreshToken header: ", refreshTokenHeader);

	if (authHeader && authHeader.startsWith("Bearer")) {
		token = authHeader.split(" ")[1];
		console.log("accessToken: ", authHeader);

		if (!token) {
			return res.status(401).json({
				status: 401,
				message: "no access token, auth denied",
			});
		}

		try {
			const decoded = jwt.verify(token, jwtSecret);
			req.user = decoded;
			next();
		} catch (error) {
			//check refresh token
			try {
				if (refreshTokenHeader && refreshTokenHeader.startsWith("Bearer")) {
					token = refreshTokenHeader.split(" ")[1];
					console.log("refreshToken: ", refreshTokenHeader);
					if (!token) {
						return res.status(401).json({
							status: 401,
							message: "no refresh token, auth denied",
						});
					}
					const decoded = jwt.verify(token, jwtSecret);
					req.user = decoded;
					next();
				}
			} catch (error) {
				return res.status(400).json({
					status: 400,
					message: "refresh token is not valid",
				});
			}
		}
	} else {
		return res.status(401).json({
			status: 401,
			message: "no access token, auth denied",
		});
	}
};
