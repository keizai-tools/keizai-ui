describe('Forgot password', () => {
	const authPage = {
		img: {
			src: '/welcome.svg',
			alt: 'Welcome image',
		},
		title: 'Discover Keizai',
		description: 'Next-gen testing for Soroban.',
		url: 'https://www.keizai.dev/',
	};
	const user = {
		code: '369401',
		username: Cypress.env('cognitoE2EUsername'),
		password: Cypress.env('cognitoE2EPassword'),
	};
	const cognitoUrl = Cypress.env('cognitoEndpoint');
	const password = {
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

	enum AUTH_VALIDATIONS {
		CODE_INVALID = 'Must be 6 character long and only contain numbers. E.g. 123456',
		CODE_REQUIRED = 'Code is required',
		CODE_DELIVERY_FAILURE = 'The verification code was not delivered correctly. Please resend code',
		CONFIRM_PASSWORD_REQUIRED = 'Confirm password is required',
		CONFIRM_PASSWORD_NOT_MATCH = 'Passwords do not match',
		EMAIL_INVALID = 'Enter in the format: name@example.com',
		EMAIL_REQUIRED = 'Email is required',
		NEW_PASSWORD_REQUIRED = 'New password is required',
		PASSWORD_INVALID = 'Your password must be at least',
	}

	enum FORGOT_PASSWORD_RESPONSE {
		CODE_CONFIRMATION_INVALID = 'Invalid confirmation code. Please resend code or verify the email is correct',
		CODE_DELIVERY_FAILURE = 'The verification code was not delivered correctly. Please resend code',
		CODE_EXPIRED = 'Confirmation code expired. Please resend code',
		INVALID_PASSWORD = "Sorry, one of your passwords isn't right. Follow the detailed requirements below",
		NOT_AUTHORIZED = 'The email and code you entered did not match our records. Please double-check and try again',
		USER_NOT_FOUND = 'The user is not found. Please verify that the code you enter or the email are correct',
	}

	beforeEach(() => {
		cy.visit(`${Cypress.env('loginUrl')}`);
		cy.getBySel('login-form-footer-password-link').click();
	});
	it('Should show a recovery password form', () => {
		cy.getBySel('auth-page-container').should('exist').and('be.visible');
		cy.getBySel('auth-page-banner-container').should('exist').and('be.visible');
		cy.getBySel('auth-page-banner-img')
			.should('be.visible')
			.and('have.attr', 'src', authPage.img.src)
			.and('have.attr', 'alt', authPage.img.alt);
		cy.getBySel('auth-page-banner-title')
			.should('be.visible')
			.contains(authPage.title);
		cy.getBySel('auth-page-banner-info')
			.should('be.visible')
			.contains(authPage.description);
		cy.getBySel('auth-page-banner-link')
			.should('be.visible')
			.and('have.attr', 'href', authPage.url);
		cy.getBySel('recovery-password-form-container')
			.should('exist')
			.and('be.visible');
		cy.getBySel('recovery-password-title')
			.should('be.visible')
			.contains(password.recovery.title);
		cy.getBySel('recovery-password-email-send-code')
			.should('be.visible')
			.and('have.attr', 'placeholder', password.recovery.username);
		cy.getBySel('recovery-password-btn-submit')
			.should('be.visible')
			.and('have.text', password.recovery.btnSubmit);
	});
	it('Should show an error message when the email is empty or invalid', () => {
		cy.getBySel('recovery-password-btn-submit').click();
		cy.getBySel('recovery-password-error')
			.should('be.visible')
			.and('have.text', AUTH_VALIDATIONS.EMAIL_REQUIRED);
		cy.getBySel('recovery-password-email-send-code').type(
			password.recovery.invalidUsername,
		);
		cy.getBySel('recovery-password-error')
			.should('be.visible')
			.and('have.text', AUTH_VALIDATIONS.EMAIL_INVALID);
	});
	it('Should show a toast with an error message when send code failed', () => {
		cy.intercept('POST', cognitoUrl, { forceNetworkError: true });
		cy.getBySel('recovery-password-email-send-code').type(user.username);
		cy.getBySel('recovery-password-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should show a forgot password form', () => {
		const response = 'SUCCESS';
		cy.intercept('POST', cognitoUrl, response);
		cy.getBySel('recovery-password-email-send-code').type(user.username);
		cy.getBySel('recovery-password-btn-submit').click();

		cy.getBySel('auth-page-container').should('exist').and('be.visible');
		cy.getBySel('auth-page-banner-container').should('exist').and('be.visible');
		cy.getBySel('auth-page-banner-img')
			.should('be.visible')
			.and('have.attr', 'src', authPage.img.src)
			.and('have.attr', 'alt', authPage.img.alt);
		cy.getBySel('auth-page-banner-title')
			.should('be.visible')
			.contains(authPage.title);
		cy.getBySel('auth-page-banner-info')
			.should('be.visible')
			.contains(authPage.description);
		cy.getBySel('auth-page-banner-link')
			.should('be.visible')
			.and('have.attr', 'href', authPage.url);
		cy.getBySel('forgot-password-form-container')
			.should('exist')
			.and('be.visible');
		cy.getBySel('forgot-password-title')
			.should('be.visible')
			.contains(password.forgot.title);
		cy.getBySel('forgot-password-code')
			.should('be.visible')
			.and('have.attr', 'placeholder', password.forgot.code);
		cy.getBySel('form-input-password')
			.eq(0)
			.should('be.visible')
			.and('have.attr', 'placeholder', password.forgot.newPassword);
		cy.getBySel('form-input-password')
			.eq(1)
			.should('be.visible')
			.and('have.attr', 'placeholder', password.forgot.confirmPassword);
		cy.getBySel('forgot-password-btn-submit')
			.should('be.visible')
			.contains(password.forgot.btnSubmit);
		cy.getBySel('forgot-password-footer-info')
			.should('be.visible')
			.contains(password.forgot.footer.info);
		cy.getBySel('forgot-password-footer-link')
			.should('be.visible')
			.and('have.attr', 'href', password.forgot.footer.link.url)
			.contains(password.forgot.footer.link.title);
	});
	it('Should show an error message when the fields are empty', () => {
		const response = 'SUCCESS';
		cy.intercept('POST', cognitoUrl, response);

		cy.getBySel('recovery-password-email-send-code').type(user.username);
		cy.getBySel('recovery-password-btn-submit').click();
		cy.getBySel('forgot-password-btn-submit').click();
		cy.getBySel('forgot-password-code-error')
			.should('be.visible')
			.and('have.text', AUTH_VALIDATIONS.CODE_REQUIRED);
		cy.getBySel('new-password-error-message')
			.should('be.visible')
			.and('have.text', AUTH_VALIDATIONS.NEW_PASSWORD_REQUIRED);
		cy.getBySel('confirm-password-reset-error')
			.should('be.visible')
			.and('have.text', AUTH_VALIDATIONS.CONFIRM_PASSWORD_REQUIRED);
	});
	it('Should show an error message when the code and new password are invalid', () => {
		const response = 'SUCCESS';
		cy.intercept('POST', cognitoUrl, response);

		cy.getBySel('recovery-password-email-send-code').type(user.username);
		cy.getBySel('recovery-password-btn-submit').click();

		cy.getBySel('forgot-password-code').type(password.forgot.error.codeInvalid);
		cy.getBySel('form-input-password')
			.eq(0)
			.type(password.forgot.error.invalidPassword);

		cy.getBySel('forgot-password-btn-submit').click();
		cy.getBySel('forgot-password-code-error')
			.should('be.visible')
			.and('have.text', AUTH_VALIDATIONS.CODE_INVALID);
		cy.getBySel('new-password-error-message')
			.should('be.visible')
			.and('have.text', AUTH_VALIDATIONS.PASSWORD_INVALID);
		cy.getBySel('password-error-requeriment').should('be.visible');
	});
	it('Should show an error message when the password does not meet the required pattern', () => {
		const response = 'SUCCESS';
		cy.intercept('POST', cognitoUrl, response);

		cy.getBySel('recovery-password-email-send-code').type(user.username);
		cy.getBySel('recovery-password-btn-submit').click();
		cy.getBySel('form-input-password')
			.eq(0)
			.type(password.forgot.error.invalidPassword);
		cy.getBySel('form-input-password')
			.eq(1)
			.type(`${password.forgot.error.invalidPassword}+`);
		cy.getBySel('forgot-password-btn-submit').click();

		cy.getBySel('confirm-password-reset-error')
			.should('be.visible')
			.and('have.text', AUTH_VALIDATIONS.CONFIRM_PASSWORD_NOT_MATCH);
	});
	it('Should show an error message in an alert for the exception CodeMismatchException', () => {
		const response = 'SUCCESS';
		cy.intercept('POST', cognitoUrl, response);
		cy.getBySel('recovery-password-email-send-code').type(user.username);
		cy.getBySel('recovery-password-btn-submit').click();

		cy.getBySel('forgot-password-code').type(user.code);
		cy.getBySel('form-input-password').eq(0).type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);

		cy.intercept('POST', cognitoUrl, (req) => {
			req.reply({
				statusCode: 500,
				body: {
					code: 'CodeMismatchException',
				},
			});
		});
		cy.getBySel('forgot-password-btn-submit').click();
		cy.getBySel('forgot-password-form-error-title')
			.should('be.visible')
			.and('have.text', password.forgot.error.alertTitle);
		cy.getBySel('forgot-password-form-error-info')
			.should('be.visible')
			.and('have.text', FORGOT_PASSWORD_RESPONSE.CODE_CONFIRMATION_INVALID);
	});
	it('Should show an error message in an alert for the exception CodeDeliveryFailureException', () => {
		const response = 'SUCCESS';
		cy.intercept('POST', cognitoUrl, response);
		cy.getBySel('recovery-password-email-send-code').type(user.username);
		cy.getBySel('recovery-password-btn-submit').click();

		cy.getBySel('forgot-password-code').type(user.code);
		cy.getBySel('form-input-password').eq(0).type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);

		cy.intercept('POST', cognitoUrl, (req) => {
			req.reply({
				statusCode: 500,
				body: {
					code: 'CodeDeliveryFailureException',
				},
			});
		});
		cy.getBySel('forgot-password-btn-submit').click();
		cy.getBySel('forgot-password-form-error-title')
			.should('be.visible')
			.and('have.text', password.forgot.error.alertTitle);
		cy.getBySel('forgot-password-form-error-info')
			.should('be.visible')
			.and('have.text', FORGOT_PASSWORD_RESPONSE.CODE_DELIVERY_FAILURE);
	});
	it('Should show an error message in an alert for the exception ExpiredCodeException', () => {
		const response = 'SUCCESS';
		cy.intercept('POST', cognitoUrl, response);
		cy.getBySel('recovery-password-email-send-code').type(user.username);
		cy.getBySel('recovery-password-btn-submit').click();

		cy.getBySel('forgot-password-code').type(user.code);
		cy.getBySel('form-input-password').eq(0).type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);

		cy.intercept('POST', cognitoUrl, (req) => {
			req.reply({
				statusCode: 500,
				body: {
					code: 'ExpiredCodeException',
				},
			});
		});
		cy.getBySel('forgot-password-btn-submit').click();
		cy.getBySel('forgot-password-form-error-title')
			.should('be.visible')
			.and('have.text', password.forgot.error.alertTitle);
		cy.getBySel('forgot-password-form-error-info')
			.should('be.visible')
			.and('have.text', FORGOT_PASSWORD_RESPONSE.CODE_EXPIRED);
	});
	it('Should show an error message in an alert for the exception InvalidPasswordException', () => {
		const response = 'SUCCESS';
		cy.intercept('POST', cognitoUrl, response);
		cy.getBySel('recovery-password-email-send-code').type(user.username);
		cy.getBySel('recovery-password-btn-submit').click();

		cy.getBySel('forgot-password-code').type(user.code);
		cy.getBySel('form-input-password').eq(0).type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);

		cy.intercept('POST', cognitoUrl, (req) => {
			req.reply({
				statusCode: 500,
				body: {
					code: 'InvalidPasswordException',
				},
			});
		});
		cy.getBySel('forgot-password-btn-submit').click();
		cy.getBySel('forgot-password-form-error-title')
			.should('be.visible')
			.and('have.text', password.forgot.error.alertTitle);
		cy.getBySel('forgot-password-form-error-info')
			.should('be.visible')
			.and('have.text', FORGOT_PASSWORD_RESPONSE.INVALID_PASSWORD);
	});
	it('Should show an error message in an alert for the exception NotAuthorizedException', () => {
		const response = 'SUCCESS';
		cy.intercept('POST', cognitoUrl, response);
		cy.getBySel('recovery-password-email-send-code').type(user.username);
		cy.getBySel('recovery-password-btn-submit').click();

		cy.getBySel('forgot-password-code').type(user.code);
		cy.getBySel('form-input-password').eq(0).type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);

		cy.intercept('POST', cognitoUrl, (req) => {
			req.reply({
				statusCode: 500,
				body: {
					code: 'NotAuthorizedException',
				},
			});
		});
		cy.getBySel('forgot-password-btn-submit').click();
		cy.getBySel('forgot-password-form-error-title')
			.should('be.visible')
			.and('have.text', password.forgot.error.alertTitle);
		cy.getBySel('forgot-password-form-error-info')
			.should('be.visible')
			.and('have.text', FORGOT_PASSWORD_RESPONSE.NOT_AUTHORIZED);
	});
	it('Should show an error message in an alert for the exception UserNotFoundException', () => {
		const response = 'SUCCESS';
		cy.intercept('POST', cognitoUrl, response);
		cy.getBySel('recovery-password-email-send-code').type(user.username);
		cy.getBySel('recovery-password-btn-submit').click();

		cy.getBySel('forgot-password-code').type(user.code);
		cy.getBySel('form-input-password').eq(0).type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);

		cy.intercept('POST', cognitoUrl, (req) => {
			req.reply({
				statusCode: 500,
				body: {
					code: 'UserNotFoundException',
				},
			});
		});
		cy.getBySel('forgot-password-btn-submit').click();
		cy.getBySel('forgot-password-form-error-container').should('be.visible');
		cy.getBySel('forgot-password-form-error-title')
			.should('be.visible')
			.and('have.text', password.forgot.error.alertTitle);
		cy.getBySel('forgot-password-form-error-info')
			.should('be.visible')
			.and('have.text', FORGOT_PASSWORD_RESPONSE.USER_NOT_FOUND);
	});
	it('Should show a toast with an error message for the exception InternalErrorException', () => {
		const response = 'SUCCESS';
		cy.intercept('POST', cognitoUrl, response);
		cy.getBySel('recovery-password-email-send-code').type(user.username);
		cy.getBySel('recovery-password-btn-submit').click();

		cy.getBySel('forgot-password-code').type(user.code);
		cy.getBySel('form-input-password').eq(0).type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);

		cy.intercept('POST', cognitoUrl, (req) => {
			req.reply({
				statusCode: 500,
				body: {
					code: 'InternalErrorException',
				},
			});
		});
		cy.getBySel('forgot-password-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should show a toast with an error message for the exception InvalidParameterException', () => {
		const response = 'SUCCESS';
		cy.intercept('POST', cognitoUrl, response);
		cy.getBySel('recovery-password-email-send-code').type(user.username);
		cy.getBySel('recovery-password-btn-submit').click();

		cy.getBySel('forgot-password-code').type(user.code);
		cy.getBySel('form-input-password').eq(0).type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);

		cy.intercept('POST', cognitoUrl, (req) => {
			req.reply({
				statusCode: 500,
				body: {
					code: 'InvalidParameterException',
				},
			});
		});
		cy.getBySel('forgot-password-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should show a toast with an error message for the exception RequestExpired', () => {
		const response = 'SUCCESS';
		cy.intercept('POST', cognitoUrl, response);
		cy.getBySel('recovery-password-email-send-code').type(user.username);
		cy.getBySel('recovery-password-btn-submit').click();

		cy.getBySel('forgot-password-code').type(user.code);
		cy.getBySel('form-input-password').eq(0).type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);

		cy.intercept('POST', cognitoUrl, (req) => {
			req.reply({
				statusCode: 500,
				body: {
					code: 'RequestExpired',
				},
			});
		});
		cy.getBySel('forgot-password-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should show a toast with an error message for the exception ServiceUnavailable', () => {
		const response = 'SUCCESS';
		cy.intercept('POST', cognitoUrl, response);
		cy.getBySel('recovery-password-email-send-code').type(user.username);
		cy.getBySel('recovery-password-btn-submit').click();

		cy.getBySel('forgot-password-code').type(user.code);
		cy.getBySel('form-input-password').eq(0).type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);

		cy.intercept('POST', cognitoUrl, (req) => {
			req.reply({
				statusCode: 500,
				body: {
					code: 'ServiceUnavailable',
				},
			});
		});
		cy.getBySel('forgot-password-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should show a toast with an error message for the exception TooManyRequestsException', () => {
		const response = 'SUCCESS';
		cy.intercept('POST', cognitoUrl, response);
		cy.getBySel('recovery-password-email-send-code').type(user.username);
		cy.getBySel('recovery-password-btn-submit').click();

		cy.getBySel('forgot-password-code').type(user.code);
		cy.getBySel('form-input-password').eq(0).type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);

		cy.intercept('POST', cognitoUrl, (req) => {
			req.reply({
				statusCode: 500,
				body: {
					code: 'TooManyRequestsException',
				},
			});
		});
		cy.getBySel('forgot-password-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should show an error message by default if it does not match any exception', () => {
		const response = 'SUCCESS';
		cy.intercept('POST', cognitoUrl, response);
		cy.getBySel('recovery-password-email-send-code').type(user.username);
		cy.getBySel('recovery-password-btn-submit').click();

		cy.getBySel('forgot-password-code').type(user.code);
		cy.getBySel('form-input-password').eq(0).type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);

		cy.intercept('POST', cognitoUrl, (req) => {
			req.reply({
				statusCode: 400,
				body: {
					code: 'DEFAULT',
				},
			});
		});
		cy.getBySel('forgot-password-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should recover the account, resetting password', () => {
		const response = 'SUCCESS';
		cy.intercept('POST', cognitoUrl, response);

		cy.getBySel('recovery-password-email-send-code').type(user.username);
		cy.getBySel('recovery-password-btn-submit').click();

		cy.getBySel('forgot-password-code').type(user.code);
		cy.getBySel('form-input-password').eq(0).type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);
		cy.clock();
		cy.getBySel('forgot-password-btn-submit').click();

		cy.tick(4000);
		cy.url().should('include', `${Cypress.env('loginUrl')}`);
		cy.getBySel('login-form-container').should('exist').and('be.visible');
		cy.getBySel('forgot-password-form-container').should('not.exist');
	});
});
