import {
	AUTH_VALIDATIONS,
	CREATE_ACCOUNT_RESPONSE,
} from './exceptions/auth.enum';
import { user, apiUrl, authPage, registerForm } from './exceptions/constants';

xdescribe('Register', () => {
	const registerUrl = `${apiUrl}/auth/register`;

	beforeEach(() => {
		cy.visit(`${Cypress.env('registerUrl')}`);
	});

	it('Should show a register form', () => {
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
		cy.getBySel('register-form-container').should('exist').and('be.visible');
		cy.getBySel('register-form-title')
			.should('be.visible')
			.contains(registerForm.title);
		cy.getBySel('register-form-email')
			.should('be.visible')
			.and('have.attr', 'placeholder', registerForm.email);
		cy.getBySel('form-input-password')
			.should('be.visible')
			.and('have.attr', 'placeholder', registerForm.password);
		cy.getBySel('register-form-btn-submit')
			.should('be.visible')
			.contains(registerForm.btnSubmit);
		cy.getBySel('register-form-footer-info')
			.should('be.visible')
			.contains(registerForm.footer.info);
		cy.getBySel('register-form-footer-link')
			.should('be.visible')
			.and('have.attr', 'href', registerForm.footer.link.url)
			.contains(registerForm.footer.link.title);
	});
	it('Should show an error message when the email and password are empty', () => {
		cy.getBySel('register-form-btn-submit').click();
		cy.getBySel('register-form-email-error')
			.should('be.visible')
			.and('have.text', AUTH_VALIDATIONS.EMAIL_REQUIRED);
		cy.getBySel('register-form-password-error')
			.should('be.visible')
			.and('have.text', AUTH_VALIDATIONS.PASSWORD_REQUIRED);
	});
	it('Should show an error message when the email and password are invalid', () => {
		cy.getBySel('register-form-email').type(registerForm.invalidField);
		cy.getBySel('form-input-password').type(registerForm.invalidField);
		cy.getBySel('register-form-btn-submit').click();
		cy.getBySel('register-form-email-error')
			.should('be.visible')
			.and('have.text', AUTH_VALIDATIONS.EMAIL_INVALID);
		cy.getBySel('register-form-password-error')
			.should('be.visible')
			.and('have.text', AUTH_VALIDATIONS.PASSWORD_INVALID);
		cy.getBySel('password-error-requeriment').should('be.visible');
	});
	it('Should show an error message in an alert for the exception InvalidPasswordException', () => {
		cy.getBySel('register-form-email').type(user.email);
		cy.getBySel('form-input-password').type(user.password);

		cy.intercept('POST', registerUrl, {
			statusCode: 400,
			body: {
				code: 'InvalidPasswordException',
			},
		});
		cy.getBySel('register-form-btn-submit').click();
		cy.getBySel('register-form-create-error-container').should('be.visible');
		cy.getBySel('register-form-create-error-title')
			.should('be.visible')
			.and('have.text', registerForm.alertTitle);
		cy.getBySel('register-form-create-error-info')
			.should('be.visible')
			.and('have.text', CREATE_ACCOUNT_RESPONSE.INVALID_PASSWORD);
	});
	it('Should show an error message in an alert for the exception NotAuthorizedException', () => {
		cy.getBySel('register-form-email').type(user.email);
		cy.getBySel('form-input-password').type(user.password);

		cy.intercept('POST', registerUrl, {
			statusCode: 400,
			body: {
				code: 'NotAuthorizedException',
			},
		});
		cy.getBySel('register-form-btn-submit').click();
		cy.getBySel('register-form-create-error-container').should('be.visible');
		cy.getBySel('register-form-create-error-title')
			.should('be.visible')
			.and('have.text', registerForm.alertTitle);
		cy.getBySel('register-form-create-error-info')
			.should('be.visible')
			.and('have.text', CREATE_ACCOUNT_RESPONSE.NOT_AUTHORIZED);
	});
	it('Should show an error message in an alert for the exception emailExistsException', () => {
		cy.getBySel('register-form-email').type(user.email);
		cy.getBySel('form-input-password').type(user.password);

		cy.intercept('POST', registerUrl, {
			statusCode: 400,
			body: {
				code: 'emailExistsException',
			},
		});
		cy.getBySel('register-form-btn-submit').click();
		cy.getBySel('register-form-create-error-container').should('be.visible');
		cy.getBySel('register-form-create-error-title')
			.should('be.visible')
			.and('have.text', registerForm.alertTitle);
		cy.getBySel('register-form-create-error-info')
			.should('be.visible')
			.and('have.text', CREATE_ACCOUNT_RESPONSE.EMAIL_EXIST);
	});
	it('Should show a toast with an error message for the exception InternalErrorException', () => {
		cy.getBySel('register-form-email').type(user.email);
		cy.getBySel('form-input-password').type(user.password);

		cy.intercept('POST', registerUrl, {
			statusCode: 500,
			body: {
				code: 'InternalErrorException',
			},
		});
		cy.getBySel('register-form-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should show a toast with an error message for the exception InvalidParameterException', () => {
		cy.getBySel('register-form-email').type(user.email);
		cy.getBySel('form-input-password').type(user.password);

		cy.intercept('POST', registerUrl, {
			statusCode: 500,
			body: {
				code: 'InvalidParameterException',
			},
		});
		cy.getBySel('register-form-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should show a toast with an error message for the exception RequestExpired', () => {
		cy.getBySel('register-form-email').type(user.email);
		cy.getBySel('form-input-password').type(user.password);

		cy.intercept('POST', registerUrl, {
			statusCode: 500,
			body: {
				code: 'RequestExpired',
			},
		});
		cy.getBySel('register-form-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should show a toast with an error message for the exception ServiceUnavailable', () => {
		cy.getBySel('register-form-email').type(user.email);
		cy.getBySel('form-input-password').type(user.password);

		cy.intercept('POST', registerUrl, {
			statusCode: 500,
			body: {
				code: 'ServiceUnavailable',
			},
		});
		cy.getBySel('register-form-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should show a toast with an error message for the exception TooManyRequestsException', () => {
		cy.getBySel('register-form-email').type(user.email);
		cy.getBySel('form-input-password').type(user.password);

		cy.intercept('POST', registerUrl, {
			statusCode: 500,
			body: {
				code: 'TooManyRequestsException',
			},
		});
		cy.getBySel('register-form-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should show an error message by default if it does not match any exception', () => {
		cy.getBySel('register-form-email').type(user.email);
		cy.getBySel('form-input-password').type(user.password);

		cy.intercept('POST', registerUrl, {
			statusCode: 500,
			body: {
				code: 'default',
			},
		});
		cy.getBySel('register-form-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should go to the register form', () => {
		cy.url().should('include', `${Cypress.env('registerUrl')}`);
		cy.getBySel('register-form-container').should('exist').and('be.visible');
		cy.getBySel('login-form-container').should('not.exist');
		cy.getBySel('register-form-footer-link').click();
		cy.url().should('include', `${Cypress.env('loginUrl')}`);
		cy.getBySel('login-form-container').should('exist').and('be.visible');
		cy.getBySel('register-form-container').should('not.exist');
	});
});
