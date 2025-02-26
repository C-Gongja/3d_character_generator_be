import bcrypt from 'bcrypt';
import { getUserByEmailService, createUserService } from '../models/userModel.js';
import { generateToken } from '../util/generateToken.js';
import { AuthErrorHandler } from '../util/error/authErrorHandler.js';

export const signUpService = async (body) => {
	try {
		const existingUser = await getUserByEmailService(body.email);
		if (existingUser) {
			throw new AuthErrorHandler('User with this email already exists', 'EMAIL_ALREADY_EXIST');
		}

		const newUser = await createUserService(body);

		const userInfo = {
			id: newUser.id,
			name: newUser.name,
			role: newUser.role,
		};

		const { accessToken, refreshToken } = await generateToken(userInfo);

		return { user: userInfo, accessToken, refreshToken };
	} catch (error) {
		throw error;
	}
};

export const loginService = async ({ email, password }) => {
	try {
		const user = await getUserByEmailService(email);
		if (!user) {
			throw new AuthErrorHandler('Please check your email', 'EMAIL_NOT_FOUND');
		}
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			throw new AuthErrorHandler('Incorrect password', 'INVALID_PASSWORD');
		}

		const userInfo = {
			id: user.id,
			name: user.name,
			role: user.role,
		};

		const { accessToken, refreshToken } = await generateToken(userInfo);

		return { user: userInfo, accessToken, refreshToken };
	} catch (error) {
		throw error;
	}
};
