export class AuthErrorHandler extends Error {
	constructor(message, code) {
		super(message);
		this.name = 'AuthError';
		this.code = code;
	}
}