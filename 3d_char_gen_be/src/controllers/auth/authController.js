import { signUpService, loginService } from '../../models/authModel.js';

// 회원가입 컨트롤러
export const signUpController = async (req, res) => {

	try {
		// 서비스 레이어 호출
		const { user, token } = await signUpService(req.body);

		return res.status(201).json({
			message: 'User created successfully',
			user,
			token,
		});
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
};

// 로그인 컨트롤러
export const loginController = async (req, res) => {
	const { email, password } = req.body;

	// 입력값 확인
	if (!email || !password) {
		return res.status(400).json({ message: 'Email and Password are required' });
	}

	try {
		// 로그인 서비스 호출
		const { user, token } = await loginService({ email, password });

		return res.status(200).json({
			message: 'Login successful',
			user,
			token,
		});
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
};
