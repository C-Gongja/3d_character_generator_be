import jwt from "jsonwebtoken";
import { jwtSecret } from "../../config/env.js";
import { signUpService, loginService } from '../../models/authModel.js';

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
		return res.status(400).json({ message: error.message });
	}
};

// 로그인 컨트롤러
export const loginController = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ message: 'Email and Password are required' });
	}

	try {
		const { user, accessToken, refreshToken } = await loginService({ email, password });

		res
			.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict', // avoid CSRF
				maxAge: 3600 * 1000, // 1h
			});

		return res.status(200).json({
			success: true,
			user,
			accessToken,
		});
	} catch (error) {
		return res.status(400).json({ message: error.message });
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


// provide new accessToken
export const refreshTokenController = async (req, res) => {
	const refreshToken = req.cookies["refreshToken"];
	if (!refreshToken) {
		return res.status(401).send('Access Denied. No refresh token provided.');
	}

	try {
		const decoded = jwt.verify(refreshToken, jwtSecret);
		const { accessToken, refreshToken } = generateToken(decoded.user)

		res
			.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict', // avoid CSRF
				//maxAge는 쿠키의 exp time on brower.
				maxAge: 3600 * 1000, // 1h
			});

		return res.status(200).json({
			success: true,
			user,
			accessToken,
		});
	} catch (error) {
		return res.status(400).send('Invalid refresh token.');
	}
};