import { signUpService, loginService } from '../../models/authModel.js';

export const signUpController = async (req, res) => {

	try {
		const { user, token } = await signUpService(req.body);

		// HttpOnly 쿠키 설정
		res.cookie('token', token, {
			httpOnly: true,   // JavaScript로 접근 불가
			secure: process.env.NODE_ENV === 'production', // HTTPS에서만 전송 (production에서 활성화)
			sameSite: 'strict', // CSRF 방지
			maxAge: 3600 * 1000, // 1시간 (밀리초 단위)
		});

		return res.status(200).json({
			success: true,
			user,
		});
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
};

// 로그인 컨트롤러
export const loginController = async (req, res) => {
	const { email, password } = req.body;
	console.log(email);
	console.log(password);
	// 입력값 확인
	if (!email || !password) {
		return res.status(400).json({ message: 'Email and Password are required' });
	}

	try {
		// 로그인 서비스 호출
		const { user, token } = await loginService({ email, password });

		// HttpOnly 쿠키 설정
		res.cookie('token', token, {
			httpOnly: true,   // JavaScript로 접근 불가
			secure: process.env.NODE_ENV === 'production', // HTTPS에서만 전송 (production에서 활성화)
			sameSite: 'strict', // CSRF 방지
			maxAge: 3600 * 1000, // 1시간 (밀리초 단위)
		});

		return res.status(200).json({
			success: true,
			user,
		});
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
};

export const logoutController = (req, res) => {
	res.clearCookie('token', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
	});

	return res.status(200).json({ message: 'Logout successful' });
};
