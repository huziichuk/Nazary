const AUTH_MESSAGES = {
	VALIDATION: {
		LOWERCASE: 'Password must contain at least one lowercase letter',
		UPPERCASE: 'Password must contain at least one uppercase letter',
		NUMBER: 'Password must contain at least one number',
	},
	SUCCESS: {
		REGISTERED: 'Successfully registered',
		LOGGED_IN: 'Login was successfully',
		AUTHORIZED: 'User is logged in',
		LOGOUT: 'Logout was successfully',
		EMAIL_CONFIRMED: 'Email is confirmed',
		VERIFICATION_EMAIL_SENT: 'Verification email sent',
		ALREADY_CONFIRMED: 'Email is already confirmed',
	},
	ERROR: {
		USER_ALREADY_EXISTS: 'User already exists',
		USER_NOT_FOUND: 'User does not exist',
		WRONG_PASSWORD: 'Wrong password',
		NO_TOKENS: 'No tokens provided',
		UNAUTHORIZED: 'Unauthorized',
		WRONG_TOKENS: 'Wrong tokens',
		SESSION_EXPIRED: 'Session expired',
		INVALID_OR_EXPIRED_TOKEN: 'Invalid or expired token',
		ALREADY_CONFIRMED: 'Email is already confirmed',
		EMAIL_NOT_CONFIRMED: 'Email is not confirmed',
		EMAIL_IS_REQUIRED: 'Email is required',
	},
};

export default AUTH_MESSAGES;
