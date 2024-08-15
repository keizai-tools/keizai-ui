import {
	AUTH_VALIDATIONS,
	AUTH_LOGIN_RESPONSE,
	AUTH_RESPONSE,
} from './exceptions/auth.enum';
import {
	user,
	invalidUser,
	apiUrl,
	authPage,
	loginForm,
	type IApiResponseError,
} from './exceptions/constants';

xdescribe('Login management', () => {
	beforeEach(() => {
		cy.visit(`${Cypress.env('loginUrl')}`);
	});

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
			.and('have.attr', 'placeholder', loginForm.email);
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
			.and('have.text', AUTH_VALIDATIONS.EMAIL_REQUIRED);
		cy.getBySel('login-form-password-error-message')
			.should('be.visible')
			.and('have.text', AUTH_VALIDATIONS.PASSWORD_REQUIRED);
	});

	it('Should show an error message when the password is invalid', () => {
		cy.getBySel('login-form-email').type(user.email);
		cy.getBySel('form-input-password').type(invalidUser.password);
		cy.getBySel('login-form-btn-submit').click();
		cy.getBySel('password-error-requeriment').should('be.visible');
	});

	it('Should show an error message when the email is invalid', () => {
		cy.getBySel('login-form-email').type(invalidUser.email);
		cy.getBySel('form-input-password').type(user.password);
		cy.getBySel('login-form-btn-submit').click();
		cy.getBySel('login-form-email-error-message').should('be.visible');
	});

	it('Should show an error message in an alert for the exception UserNotConfirmedException', () => {
		cy.intercept('POST', `${apiUrl}/auth/login`, {
			statusCode: 403,
			body: {
				details: {
					description: AUTH_LOGIN_RESPONSE.USER_NOT_CONFIRMED,
				},
			} as IApiResponseError,
		});
		cy.getBySel('login-form-email').type(user.email);
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
		cy.intercept('POST', `${apiUrl}/auth/login`, {
			statusCode: 401,
			body: {
				details: {
					description: AUTH_LOGIN_RESPONSE.INVALID_PASSWORD,
				},
			} as IApiResponseError,
		});
		cy.getBySel('login-form-email').type(user.email);
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
		cy.intercept('POST', `${apiUrl}/auth/login`, {
			statusCode: 401,
			body: {
				details: {
					description: AUTH_LOGIN_RESPONSE.PASSWORD_RESET_REQUIRED,
				},
			} as IApiResponseError,
		});
		cy.getBySel('login-form-email').type(user.email);
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
		cy.intercept('POST', `${apiUrl}/auth/login`, {
			statusCode: 401,
			body: {
				details: {
					description: AUTH_LOGIN_RESPONSE.USER_NOT_FOUND,
				},
			} as IApiResponseError,
		});
		cy.getBySel('login-form-email').type(user.email);
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
		cy.intercept('POST', `${apiUrl}/auth/login`, {
			statusCode: 500,
			body: {
				details: {
					description: AUTH_RESPONSE.INTERNAL_ERROR,
				},
			} as IApiResponseError,
		});
		cy.getBySel('login-form-email').type(user.email);
		cy.getBySel('form-input-password').type(user.password);
		cy.getBySel('login-form-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});

	it('Should show a toast with an error message for the exception InvalidParameterException', () => {
		cy.intercept('POST', `${apiUrl}/auth/login`, {
			statusCode: 401,
			body: {
				details: {
					description: AUTH_RESPONSE.INVALID_PARAMETER,
				},
			} as IApiResponseError,
		});
		cy.getBySel('login-form-email').type(user.email);
		cy.getBySel('form-input-password').type(user.password);
		cy.getBySel('login-form-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});

	it('Should show a toast with an error message for the exception RequestExpired', () => {
		cy.intercept('POST', `${apiUrl}/auth/login`, {
			statusCode: 500,
			body: {
				details: {
					description: AUTH_RESPONSE.REQUEST_EXPIRED,
				},
			} as IApiResponseError,
		});
		cy.getBySel('login-form-email').type(user.email);
		cy.getBySel('form-input-password').type(user.password);
		cy.getBySel('login-form-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});

	it('Should show a toast with an error message for the exception ServiceUnavailable', () => {
		cy.intercept('POST', `${apiUrl}/auth/login`, {
			forceNetworkError: true,
		});
		cy.getBySel('login-form-email').type(user.email);
		cy.getBySel('form-input-password').type(user.password);
		cy.getBySel('login-form-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});

	it('Should show a toast with an error message for the exception TooManyRequestsException', () => {
		cy.intercept('POST', `${apiUrl}/auth/login`, {
			statusCode: 500,
			body: {
				details: {
					description: AUTH_RESPONSE.TOO_MANY_REQUEST,
				},
			} as IApiResponseError,
		});
		cy.getBySel('login-form-email').type(user.email);
		cy.getBySel('form-input-password').type(user.password);
		cy.getBySel('login-form-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});

	xit('Should log in', () => {
		cy.getBySel('login-form-email').type(user.email);
		cy.getBySel('form-input-password').type(user.password);
		cy.getBySel('login-form-btn-submit').click();
		cy.url().should('not.include', `${Cypress.env('loginUrl')}`);
	});
});
