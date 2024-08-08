import { AUTH_VALIDATIONS } from './exceptions/auth.enum';
import { user, cognitoUrl, changePassword } from './exceptions/constants';

xdescribe('Change password', () => {
	beforeEach(() => {
		cy.loginByCognitoApi();
		cy.getBySel('sidebar-btn-user').click();
		cy.getBySel('user-dropdown-change-password').click();
		cy.getBySel('change-password-form-container').click();
		cy.url().should('include', `${Cypress.env('changePasswordUrl')}`);
	});
	it('Should show a change password form', () => {
		cy.getBySel('change-password-form-container').and('be.visible');
		cy.getBySel('change-password-title')
			.should('be.visible')
			.contains(changePassword.title);
		cy.getBySel('form-input-password')
			.should('be.visible')
			.eq(0)
			.should('have.attr', 'placeholder', changePassword.oldPassword);
		cy.getBySel('form-input-password')
			.should('be.visible')
			.eq(1)
			.should('have.attr', 'placeholder', changePassword.newPassword);
		cy.getBySel('form-input-password')
			.should('be.visible')
			.eq(2)
			.should('have.attr', 'placeholder', changePassword.confirmPassword);
		cy.getBySel('change-password-btn-submit')
			.should('be.visible')
			.contains(changePassword.btnSubmit);
	});
	it('Should show an error messages when submitting with empty fields', () => {
		cy.getBySel('change-password-btn-submit').click();
		cy.getBySel('old-password-error')
			.should('be.visible')
			.and('have.text', AUTH_VALIDATIONS.OLD_PASSWORD_REQUIRED);
		cy.getBySel('new-password-error')
			.should('be.visible')
			.and('have.text', AUTH_VALIDATIONS.NEW_PASSWORD_REQUIRED);
		cy.getBySel('confirm-password-error')
			.should('be.visible')
			.and('have.text', AUTH_VALIDATIONS.CONFIRM_PASSWORD_REQUIRED);
	});
	it('Should show an error message when old password and new password are invalid', () => {
		cy.wait(1000);
		cy.getBySel('form-input-password').eq(0).type('test0');
		cy.getBySel('form-input-password').eq(1).type('test0');
		cy.getBySel('change-password-btn-submit').click();
		cy.getBySel('old-password-error').should('be.visible');
		cy.getBySel('new-password-error').should('be.visible');
	});
	it('Should show an error message when passwords do not match', () => {
		cy.getBySel('form-input-password').eq(1).type('test0');
		cy.getBySel('form-input-password').eq(2).type('test1');
		cy.getBySel('change-password-btn-submit').click();
		cy.getBySel('confirm-password-error').contains(
			AUTH_VALIDATIONS.CONFIRM_PASSWORD_NOT_MATCH,
		);
	});
	it('Should show an error message in an alert for the exception InvalidPasswordException', () => {
		cy.wait(1000);
		cy.getBySel('form-input-password').first().type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);
		cy.getBySel('form-input-password').eq(2).type(user.password);

		cy.intercept('POST', cognitoUrl, {
			statusCode: 400,
			body: {
				code: 'InvalidPasswordException',
			},
		});
		cy.getBySel('change-password-btn-submit').click();
		cy.getBySel('change-password-error-message-title')
			.should('be.visible')
			.and('have.text', changePassword.alertTitle);
		cy.getBySel('change-password-error-message-info').should('be.visible');
	});
	it('Should show an error message in an alert for the exception NotAuthorizedException', () => {
		cy.intercept('POST', cognitoUrl, {
			statusCode: 400,
			body: {
				code: 'NotAuthorizedException',
			},
		});
		cy.wait(1000);
		cy.getBySel('form-input-password').first().type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);
		cy.getBySel('form-input-password').eq(2).type(user.password);
		cy.getBySel('change-password-btn-submit').click();
		cy.getBySel('change-password-error-message-title').should('be.visible');
	});
	it('Should show an error message in an alert for the exception PasswordResetRequiredException', () => {
		cy.intercept('POST', cognitoUrl, {
			statusCode: 400,
			body: {
				code: 'PasswordResetRequiredException',
			},
		});
		cy.wait(1000);
		cy.getBySel('form-input-password').first().type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);
		cy.getBySel('form-input-password').eq(2).type(user.password);
		cy.getBySel('change-password-btn-submit').click();
		cy.getBySel('change-password-error-message-title')
			.should('be.visible')
			.and('have.text', changePassword.alertTitle);
		cy.getBySel('change-password-error-message-info').should('be.visible');
	});
	it('Should show an error message in an alert for the exception UserNotConfirmedException', () => {
		cy.wait(1000);
		cy.getBySel('form-input-password').first().type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);
		cy.getBySel('form-input-password').eq(2).type(user.password);

		cy.intercept('POST', cognitoUrl, {
			statusCode: 400,
			body: {
				code: 'UserNotConfirmedException',
			},
		});

		cy.getBySel('change-password-btn-submit').click();
		cy.getBySel('change-password-error-message-title')
			.should('be.visible')
			.and('have.text', changePassword.alertTitle);
		cy.getBySel('change-password-error-message-info').should('be.visible');
	});
	it('Should show an error message in an alert for the exception UserNotFoundException', () => {
		cy.intercept('POST', cognitoUrl, {
			statusCode: 400,
			body: {
				code: 'UserNotFoundException',
			},
		});
		cy.wait(1000);
		cy.getBySel('form-input-password').first().type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);
		cy.getBySel('form-input-password').eq(2).type(user.password);
		cy.getBySel('change-password-btn-submit').click();
		cy.getBySel('change-password-error-message-title')
			.should('be.visible')
			.and('have.text', changePassword.alertTitle);
		cy.getBySel('change-password-error-message-info').should('be.visible');
	});
	it('Should show a toast with an error message for the exception InternalErrorException', () => {
		cy.intercept('POST', cognitoUrl, {
			statusCode: 500,
			body: {
				code: 'InternalErrorException',
			},
		});

		cy.getBySel('form-input-password').first().type(user.password);
		cy.wait(1000);
		cy.getBySel('form-input-password').eq(1).type(user.password);
		cy.getBySel('form-input-password').eq(2).type(user.password);
		cy.getBySel('change-password-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should show a toast with an error message for the exception InvalidParameterException', () => {
		cy.wait(1000);
		cy.getBySel('form-input-password').first().type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);
		cy.getBySel('form-input-password').eq(2).type(user.password);

		cy.intercept('POST', cognitoUrl, {
			statusCode: 500,
			body: {
				code: 'InvalidParameterException',
			},
		});

		cy.getBySel('change-password-btn-submit').click();
		cy.getBySel('toast-description').should('be.visible');
	});
	it('Should show a toast with an error message for the exception RequestExpired', () => {
		cy.wait(1000);
		cy.getBySel('form-input-password').first().type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);
		cy.getBySel('form-input-password').eq(2).type(user.password);

		cy.intercept('POST', cognitoUrl, {
			statusCode: 500,
			body: {
				code: 'RequestExpired',
			},
		});

		cy.getBySel('change-password-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should show a toast with an error message for the exception ServiceUnavailable', () => {
		cy.wait(1000);
		cy.getBySel('form-input-password').first().type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);
		cy.getBySel('form-input-password').eq(2).type(user.password);

		cy.intercept('POST', cognitoUrl, {
			statusCode: 500,
			body: {
				code: 'ServiceUnavailable',
			},
		});
		cy.getBySel('change-password-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should show a toast with an error message for the exception TooManyRequestsException', () => {
		cy.wait(1000);
		cy.getBySel('form-input-password').first().type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);
		cy.getBySel('form-input-password').eq(2).type(user.password);

		cy.intercept('POST', cognitoUrl, {
			statusCode: 500,
			body: {
				code: 'TooManyRequestsException',
			},
		});
		cy.getBySel('change-password-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should show an error message by default if it does not match any exception', () => {
		cy.wait(1000);
		cy.getBySel('form-input-password').first().type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);
		cy.getBySel('form-input-password').eq(2).type(user.password);

		cy.intercept('POST', cognitoUrl, {
			statusCode: 400,
			body: {
				code: 'DEFAULT',
			},
		});
		cy.getBySel('change-password-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should change a password successfully', () => {
		cy.wait(1000);
		cy.getBySel('form-input-password').first().type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);
		cy.getBySel('form-input-password').eq(2).type(user.password);
		cy.getBySel('change-password-btn-submit').click();
	});
});
