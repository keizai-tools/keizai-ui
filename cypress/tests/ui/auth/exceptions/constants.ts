export const user = {
	code: '369401',
	username: Cypress.env('cognitoE2EUsername'),
	password: Cypress.env('cognitoE2EPassword'),
};

export const invalidUser = {
	username: 'test',
	password: 'test',
};

export const apiUrl = Cypress.env('apiUrl');
export const cognitoUrl = Cypress.env('cognitoEndpoint');

export const authPage = {
	img: {
		src: '/welcome.svg',
		alt: 'Welcome image',
	},
	title: 'Discover Keizai',
	description: 'Next-gen testing for Soroban.',
	url: 'https://www.keizai.dev/',
};

export const loginForm = {
	title: 'Welcome Back',
	username: 'Email',
	password: 'Password',
	btnSubmit: 'Login',
	footer: {
		info: "Don't have an account?",
		loginLink: {
			title: 'Join now',
			url: Cypress.env('registerUrl'),
		},
		passwordLink: {
			title: 'Forgot your password?',
			url: Cypress.env('forgotPasswordUrl'),
		},
	},
	errorTitle: 'Login failed',
	toastErrorTitle: 'Something when wrong!',
};

export const registerForm = {
	title: 'Create Account',
	email: 'Email',
	password: 'Password',
	btnSubmit: 'Create',
	footer: {
		info: 'Already have an account?',
		link: { title: 'Login', url: '/auth/login' },
	},
	invalidField: 'test',
	alertTitle: 'Create account failed',
};

export const forgotPassword = {
	recovery: {
		title: 'Password Recovery',
		username: 'Email',
		btnSubmit: 'Send code',
		invalidUsername: 'test.com',
	},
	forgot: {
		title: 'Password Reset',
		code: 'Code',
		newPassword: 'New Password',
		confirmPassword: 'Confirm New Password',
		btnSubmit: 'Save',
		footer: {
			info: 'Already have an account?',
			link: {
				title: 'Login',
				url: '/auth/login',
			},
		},
		error: {
			codeInvalid: '123a56',
			invalidPassword: 'test',
			alertTitle: 'Reset password failed',
		},
	},
};

export const changePassword = {
	title: 'Change Password',
	oldPassword: 'Old Password',
	newPassword: 'New Password',
	confirmPassword: 'Confirm New Password',
	btnSubmit: 'Update password',
	alertTitle: 'Change password failed',
};
