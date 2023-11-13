import {
	AUTH_VALIDATIONS,
	FORGOT_PASSWORD_RESPONSE,
} from './exceptions/auth.enum';
import {
	user,
	cognitoUrl,
	authPage,
	forgotPassword,
} from './exceptions/constants';

describe('Forgot password', () => {
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
			.contains(forgotPassword.recovery.title);
		cy.getBySel('recovery-password-email-send-code')
			.should('be.visible')
			.and('have.attr', 'placeholder', forgotPassword.recovery.username);
		cy.getBySel('recovery-password-btn-submit')
			.should('be.visible')
			.and('have.text', forgotPassword.recovery.btnSubmit);
	});
	it('Should show an error message when the email is empty or invalid', () => {
		cy.getBySel('recovery-password-btn-submit').click();
		cy.getBySel('recovery-password-error')
			.should('be.visible')
			.and('have.text', AUTH_VALIDATIONS.EMAIL_REQUIRED);
		cy.getBySel('recovery-password-email-send-code').type(
			forgotPassword.recovery.invalidUsername,
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
			.contains(forgotPassword.forgot.title);
		cy.getBySel('forgot-password-code')
			.should('be.visible')
			.and('have.attr', 'placeholder', forgotPassword.forgot.code);
		cy.getBySel('form-input-password')
			.eq(0)
			.should('be.visible')
			.and('have.attr', 'placeholder', forgotPassword.forgot.newPassword);
		cy.getBySel('form-input-password')
			.eq(1)
			.should('be.visible')
			.and('have.attr', 'placeholder', forgotPassword.forgot.confirmPassword);
		cy.getBySel('forgot-password-btn-submit')
			.should('be.visible')
			.contains(forgotPassword.forgot.btnSubmit);
		cy.getBySel('forgot-password-footer-info')
			.should('be.visible')
			.contains(forgotPassword.forgot.footer.info);
		cy.getBySel('forgot-password-footer-link')
			.should('be.visible')
			.and('have.attr', 'href', forgotPassword.forgot.footer.link.url)
			.contains(forgotPassword.forgot.footer.link.title);
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

		cy.getBySel('forgot-password-code').type(
			forgotPassword.forgot.error.codeInvalid,
		);
		cy.getBySel('form-input-password')
			.eq(0)
			.type(forgotPassword.forgot.error.invalidPassword);

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
			.type(forgotPassword.forgot.error.invalidPassword);
		cy.getBySel('form-input-password')
			.eq(1)
			.type(`${forgotPassword.forgot.error.invalidPassword}+`);
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

		cy.intercept('POST', cognitoUrl, {
			statusCode: 500,
			body: {
				code: 'CodeMismatchException',
			},
		});
		cy.getBySel('forgot-password-btn-submit').click();
		cy.getBySel('forgot-password-form-error-title')
			.should('be.visible')
			.and('have.text', forgotPassword.forgot.error.alertTitle);
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

		cy.intercept('POST', cognitoUrl, {
			statusCode: 500,
			body: {
				code: 'CodeDeliveryFailureException',
			},
		});
		cy.getBySel('forgot-password-btn-submit').click();
		cy.getBySel('forgot-password-form-error-title')
			.should('be.visible')
			.and('have.text', forgotPassword.forgot.error.alertTitle);
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

		cy.intercept('POST', cognitoUrl, {
			statusCode: 500,
			body: {
				code: 'ExpiredCodeException',
			},
		});
		cy.getBySel('forgot-password-btn-submit').click();
		cy.getBySel('forgot-password-form-error-title')
			.should('be.visible')
			.and('have.text', forgotPassword.forgot.error.alertTitle);
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

		cy.intercept('POST', cognitoUrl, {
			statusCode: 500,
			body: {
				code: 'InvalidPasswordException',
			},
		});
		cy.getBySel('forgot-password-btn-submit').click();
		cy.getBySel('forgot-password-form-error-title')
			.should('be.visible')
			.and('have.text', forgotPassword.forgot.error.alertTitle);
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

		cy.intercept('POST', cognitoUrl, {
			statusCode: 500,
			body: {
				code: 'NotAuthorizedException',
			},
		});
		cy.getBySel('forgot-password-btn-submit').click();
		cy.getBySel('forgot-password-form-error-title')
			.should('be.visible')
			.and('have.text', forgotPassword.forgot.error.alertTitle);
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

		cy.intercept('POST', cognitoUrl, {
			statusCode: 500,
			body: {
				code: 'UserNotFoundException',
			},
		});
		cy.getBySel('forgot-password-btn-submit').click();
		cy.getBySel('forgot-password-form-error-container').should('be.visible');
		cy.getBySel('forgot-password-form-error-title')
			.should('be.visible')
			.and('have.text', forgotPassword.forgot.error.alertTitle);
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

		cy.intercept('POST', cognitoUrl, {
			statusCode: 500,
			body: {
				code: 'InternalErrorException',
			},
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

		cy.intercept('POST', cognitoUrl, {
			statusCode: 500,
			body: {
				code: 'InvalidParameterException',
			},
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

		cy.intercept('POST', cognitoUrl, {
			statusCode: 500,
			body: {
				code: 'RequestExpired',
			},
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

		cy.intercept('POST', cognitoUrl, {
			statusCode: 500,
			body: {
				code: 'ServiceUnavailable',
			},
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

		cy.intercept('POST', cognitoUrl, {
			statusCode: 500,
			body: {
				code: 'TooManyRequestsException',
			},
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

		cy.intercept('POST', cognitoUrl, {
			statusCode: 400,
			body: {
				code: 'DEFAULT',
			},
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
