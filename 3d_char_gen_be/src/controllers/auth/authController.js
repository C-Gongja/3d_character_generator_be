import jwt from "jsonwebtoken";
import { jwtSecret } from "../../config/env.js";
import { signUpService, loginService } from '../../models/authModel.js';
import { generateToken } from '../../util/generateToken.js'
import { AuthErrorHandler } from "../../util/error/authErrorHandler.js";

export const signUpController = async (req, res) => {

	try {
		const { user, accessToken, refreshToken } = await signUpService(req.body);

		res
			.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 3600 * 1000,
			});

		return res.status(200).json({
			success: true,
			user,
			accessToken,
		});
	} catch (error) {
		if (error instanceof AuthErrorHandler) {
			return res.status(401).json({
				success: false,
				errorCode: error.code,
				message: error.message,
			});
		}

		//internal error
		console.error('Login error:', error.message);
		return res.status(500).json({
			success: false,
			errorCode: 'INTERNAL_SERVER_ERROR',
			message: 'An unexpected error occurred',
		});
	}
};

export const loginController = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({
			success: false,
			errorCode: 'MISSING_FIELDS',
			message: 'Email and password are required',
		});
	}

	try {
		const { user, accessToken, refreshToken } = await loginService({ email, password });

		res
			.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict', // avoid CSRF
				maxAge: 600 * 1000,
			});

		return res.status(200).json({
			success: true,
			user,
			accessToken,
		});
	} catch (error) {
		if (error instanceof AuthErrorHandler) {
			return res.status(401).json({
				success: false,
				errorCode: error.code,
				message: error.message,
			});
		}

		//internal error
		console.error('Login error:', error.message);
		return res.status(500).json({
			success: false,
			errorCode: 'INTERNAL_SERVER_ERROR',
			message: 'An unexpected error occurred',
		});
	}
};

export const logoutController = (req, res) => {
	res.clearCookie('refreshToken', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
	});

	return res.status(200).json({ message: 'Logout successful' });
};

export const refreshTokenController = async (req, res) => {
	const refreshToken = req.cookies["refreshToken"].trim();
	if (!refreshToken) {
		return res.status(401).send('Access Denied. No refresh token provided.');
	}
	try {
		// why this is working but not the regular verify
		// verify() is async function so we have to await to finish verify to use inside try...?
		const decoded = await new Promise((resolve, reject) => {
			jwt.verify(refreshToken, jwtSecret, (err, user) => {
				if (err) reject(err);
				else resolve(user);
			});
		});

		const userInfo = {
			id: decoded.id,
			name: decoded.name,
			role: decoded.role,
		};

		const { accessToken, refreshToken: newRefreshToken } = generateToken(userInfo);

		res.cookie('refreshToken', newRefreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 3600 * 1000, // 1시간
		});

		return res.status(200).json({
			success: true,
			user: decoded, // decoded에서 user 정보 사용
			accessToken,
		});
	} catch (error) {
		console.log('Refresh token verification error:', error.name, error.message);
		if (error.name === 'TokenExpiredError') {
			return res.status(403).json({ message: 'Refresh token has expired' });
		}
		return res.status(403).json({ message: 'Invalid refresh token' });
	}
};