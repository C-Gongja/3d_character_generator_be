import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/env.js";

export const verifyToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) return res.status(401).json({ message: 'Access token is missing' });

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) {
			if (err.name === 'TokenExpiredError') {
				return res.status(401).json({ message: 'Access token has expired' });
			}
			return res.status(403).json({ message: 'Invalid access token' });
		}
		req.user = user;
		next();
	});
};
