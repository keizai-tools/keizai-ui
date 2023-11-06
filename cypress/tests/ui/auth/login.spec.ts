describe('Login management', () => {
	beforeEach(() => {
		cy.visit(`${Cypress.env('loginUrl')}`);
	});
	const cognitoUrl = Cypress.env('cognitoEndpoint');
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
		username: Cypress.env('cognitoE2EUsername'),
		password: Cypress.env('cognitoE2EPassword'),
	};
	const invalidUser = {
		username: 'test',
		password: 'test',
	};
	const loginForm = {
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
	enum INPUT_VALIDATOR {
		EMAIL_INVALID = 'Enter in the format: name@example.com',
		EMAIL_REQUIRED = 'Email is required',
		PASSWORD_INVALID = 'Your password must be at least',
		PASSWORD_REQUIRED = 'Password is required',
	}
	enum AUTH_LOGIN_RESPONSE {
		INVALID_PASSWORD = "Sorry, that password isn't right. Follow the detailed requirements below",
		NOT_AUTHORIZED = 'The email and password you entered did not match our records. Please double-check and try again',
		PASSWORD_RESET_REQUIRED = 'Password reset is required. Please click in Forgot your password? to continue',
		USER_NOT_CONFIRMED = 'The user is not confirmed, please verify your email',
		USER_NOT_FOUND = 'The user is not found. Can we help you register your email?',
	}

	it('Should show a login form', () => {
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
		cy.getBySel('login-form-container').should('exist').and('be.visible');
		cy.getBySel('login-form-title')
			.should('be.visible')
			.contains(loginForm.title);
		cy.getBySel('login-form-email')
			.should('be.visible')
			.and('have.attr', 'placeholder', loginForm.username);
		cy.getBySel('form-input-password')
			.should('be.visible')
			.and('have.attr', 'placeholder', loginForm.password);
		cy.getBySel('login-form-btn-submit')
			.should('be.visible')
			.contains(loginForm.btnSubmit);
		cy.getBySel('login-form-footer-info')
			.should('be.visible')
			.contains(loginForm.footer.info);
		cy.getBySel('login-form-footer-register-link')
			.should('be.visible')
			.and('have.attr', 'href', loginForm.footer.loginLink.url)
			.contains(loginForm.footer.loginLink.title);
		cy.getBySel('login-form-footer-password-link')
			.should('be.visible')
			.and('have.attr', 'href', loginForm.footer.passwordLink.url)
			.and('have.text', loginForm.footer.passwordLink.title);
	});
	it('Should go to the create account form', () => {
		cy.url().should('include', `${Cypress.env('loginUrl')}`);
		cy.getBySel('login-form-container').should('exist').and('be.visible');
		cy.getBySel('register-form-container').should('not.exist');
		cy.getBySel('login-form-footer-register-link').click();
		cy.url().should('include', `${Cypress.env('registerUrl')}`);
		cy.getBySel('register-form-container').should('exist').and('be.visible');
		cy.getBySel('login-form-container').should('not.exist');
	});
	it('Should show error messages with required fields when clicking the Submit button', () => {
		cy.getBySel('login-form-btn-submit').click();
		cy.getBySel('login-form-email-error-message')
			.should('be.visible')
			.and('have.text', INPUT_VALIDATOR.EMAIL_REQUIRED);
		cy.getBySel('login-form-password-error-message')
			.should('be.visible')
			.and('have.text', INPUT_VALIDATOR.PASSWORD_REQUIRED);
	});
	it('Should show error messages with invalids fields when clicking the submit button', () => {
		cy.getBySel('login-form-email').type(invalidUser.username);
		cy.getBySel('form-input-password').type(invalidUser.password);
		cy.getBySel('login-form-btn-submit').click();
		cy.getBySel('login-form-email-error-message')
			.should('be.visible')
			.and('have.text', INPUT_VALIDATOR.EMAIL_INVALID);
		cy.getBySel('login-form-password-error-message')
			.should('be.visible')
			.and('have.text', INPUT_VALIDATOR.PASSWORD_INVALID);
		cy.getBySel('password-error-requeriment').should('be.visible');
	});
	it('Should show an error message in an alert for the exception NotAuthorizedException', () => {
		cy.getBySel('login-form-email').type(user.username);
		cy.getBySel('form-input-password').type(`a${user.password}`);
		cy.getBySel('login-form-btn-submit').click();
		cy.wait(500);
		cy.getBySel('login-form-error-message-container').should('be.visible');
		cy.getBySel('login-form-error-message-title')
			.should('be.visible')
			.and('have.text', loginForm.errorTitle);
		cy.getBySel('login-form-error-message-info')
			.should('be.visible')
			.and('have.text', AUTH_LOGIN_RESPONSE.NOT_AUTHORIZED);
	});
	it('Should show an error message in an alert for the exception UserNotConfirmedException', () => {
		cy.intercept('POST', cognitoUrl, (req) => {
			req.reply({
				statusCode: 400,
				body: {
					code: 'UserNotConfirmedException',
				},
			});
		});
		cy.getBySel('login-form-email').type(user.username);
		cy.getBySel('form-input-password').type(user.password);
		cy.getBySel('login-form-btn-submit').click();
		cy.getBySel('login-form-error-message-title')
			.should('be.visible')
			.and('have.text', loginForm.errorTitle);
		cy.getBySel('login-form-error-message-info')
			.should('be.visible')
			.and('have.text', AUTH_LOGIN_RESPONSE.USER_NOT_CONFIRMED);
	});
	it('Should show an error message in an alert for the exception InvalidPasswordException', () => {
		cy.intercept('POST', cognitoUrl, (req) => {
			req.reply({
				statusCode: 400,
				body: {
					code: 'InvalidPasswordException',
				},
			});
		});
		cy.getBySel('login-form-email').type(user.username);
		cy.getBySel('form-input-password').type(user.password);
		cy.getBySel('login-form-btn-submit').click();
		cy.getBySel('login-form-error-message-title')
			.should('be.visible')
			.and('have.text', loginForm.errorTitle);
		cy.getBySel('login-form-error-message-info')
			.should('be.visible')
			.and('have.text', AUTH_LOGIN_RESPONSE.INVALID_PASSWORD);
	});
	it('Should show an error message in an alert for the exception PasswordResetRequiredException', () => {
		cy.intercept('POST', cognitoUrl, (req) => {
			req.reply({
				statusCode: 400,
				body: {
					code: 'PasswordResetRequiredException',
				},
			});
		});
		cy.getBySel('login-form-email').type(user.username);
		cy.getBySel('form-input-password').type(user.password);
		cy.getBySel('login-form-btn-submit').click();
		cy.getBySel('login-form-error-message-title')
			.should('be.visible')
			.and('have.text', loginForm.errorTitle);
		cy.getBySel('login-form-error-message-info')
			.should('be.visible')
			.and('have.text', AUTH_LOGIN_RESPONSE.PASSWORD_RESET_REQUIRED);
	});
	it('Should show an error message in an alert for the exception UserNotFoundException', () => {
		cy.intercept('POST', cognitoUrl, (req) => {
			req.reply({
				statusCode: 400,
				body: {
					code: 'UserNotFoundException',
				},
			});
		});
		cy.getBySel('login-form-email').type(user.username);
		cy.getBySel('form-input-password').type(user.password);
		cy.getBySel('login-form-btn-submit').click();
		cy.getBySel('login-form-error-message-title')
			.should('be.visible')
			.and('have.text', loginForm.errorTitle);
		cy.getBySel('login-form-error-message-info')
			.should('be.visible')
			.and('have.text', AUTH_LOGIN_RESPONSE.USER_NOT_FOUND);
	});
	it('Should show a toast with an error message for the exception InternalErrorException', () => {
		cy.intercept('POST', cognitoUrl, (req) => {
			req.reply({
				statusCode: 500,
				body: {
					code: 'InternalErrorException',
				},
			});
		});
		cy.getBySel('login-form-email').type(user.username);
		cy.getBySel('form-input-password').type(user.password);
		cy.getBySel('login-form-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should show a toast with an error message for the exception InvalidParameterException', () => {
		cy.intercept('POST', cognitoUrl, (req) => {
			req.reply({
				statusCode: 500,
				body: {
					code: 'InvalidParameterException',
				},
			});
		});
		cy.getBySel('login-form-email').type(user.username);
		cy.getBySel('form-input-password').type(user.password);
		cy.getBySel('login-form-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should show a toast with an error message for the exception RequestExpired', () => {
		cy.intercept('POST', cognitoUrl, (req) => {
			req.reply({
				statusCode: 500,
				body: {
					code: 'RequestExpired',
				},
			});
		});
		cy.getBySel('login-form-email').type(user.username);
		cy.getBySel('form-input-password').type(user.password);
		cy.getBySel('login-form-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should show a toast with an error message for the exception ServiceUnavailable', () => {
		cy.intercept('POST', cognitoUrl, (req) => {
			req.reply({
				statusCode: 500,
				body: {
					code: 'ServiceUnavailable',
				},
			});
		});
		cy.getBySel('login-form-email').type(user.username);
		cy.getBySel('form-input-password').type(user.password);
		cy.getBySel('login-form-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should show a toast with an error message for the exception TooManyRequestsException', () => {
		cy.intercept('POST', cognitoUrl, (req) => {
			req.reply({
				statusCode: 500,
				body: {
					code: 'TooManyRequestsException',
				},
			});
		});
		cy.getBySel('login-form-email').type(user.username);
		cy.getBySel('form-input-password').type(user.password);
		cy.getBySel('login-form-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should show an error message by default if it does not match any exception', () => {
		cy.intercept('POST', cognitoUrl, (req) => {
			req.reply({
				statusCode: 400,
				body: {
					code: 'DEFAULT',
				},
			});
		});
		cy.getBySel('login-form-email').type(user.username);
		cy.getBySel('form-input-password').type(user.password);
		cy.getBySel('login-form-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should log in', () => {
		cy.getBySel('login-form-email').type(user.username);
		cy.getBySel('form-input-password').type(user.password);
		cy.getBySel('login-form-btn-submit').click();
		cy.url().should('not.include', `${Cypress.env('loginUrl')}`);
	});
});
