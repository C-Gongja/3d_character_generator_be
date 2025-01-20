import bcrypt from 'bcrypt';
import { getUserByEmailService, createUserService } from '../models/userModel.js';
import { generateToken } from '../util/generateToken.js';

// 회원가입 서비스
export const signUpService = async (body) => {
	try {
		// 이메일이 이미 존재하는지 확인
		const existingUser = await getUserByEmailService(body.email);
		if (existingUser) {
			throw new Error('User with this email already exists');
		}

		// 사용자 생성
		const newUser = createUserService(body);

		const userInfo = {
			id: newUser.id,
			name: newUser.name,
			role: newUser.role,
		};

		// JWT 토큰 생성
		const token = generateToken(userInfo);
		console.log(`generate token for ${newUser.name}: ${token}`);

		return { user: newUser, token };
	} catch (error) {
		throw new Error(error.message);
	}
};

// 로그인 서비스
export const loginService = async ({ email, password }) => {
	try {
		// 이메일로 사용자 찾기
		const user = await getUserByEmailService(email);
		if (!user) {
			throw new Error('Invalid email or password');
		}

		// 비밀번호 비교
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			throw new Error('Invalid email or password');
		}

		const userInfo = {
			id: user.id,
			name: user.name,
			role: user.role,
		};

		// JWT 토큰 생성
		const token = generateToken(userInfo);

		return { user, token };
	} catch (error) {
		throw new Error(error.message);
	}
};
