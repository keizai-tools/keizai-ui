describe('Change password', () => {
	const changePassword = {
		title: 'Change Password',
		oldPassword: 'Old Password',
		newPassword: 'New Password',
		confirmPassword: 'Confirm New Password',
		btnSubmit: 'Update password',
		alertTitle: 'Change password failed',
	};
	const user = {
		username: Cypress.env('cognitoE2EUsername'),
		password: Cypress.env('cognitoE2EPassword'),
	};
	const cognitoUrl = Cypress.env('cognitoEndpoint');
	enum AUTH_VALIDATIONS {
		CONFIRM_PASSWORD_REQUIRED = 'Confirm password is required',
		CONFIRM_PASSWORD_NOT_MATCH = 'Passwords do not match',
		NEW_PASSWORD_REQUIRED = 'New password is required',
		OLD_PASSWORD_REQUIRED = 'Old password is required',
		PASSWORD_INVALID = 'Your password must be at least',
		PASSWORD_REQUIRED = 'Password is required',
	}
	enum CHANGE_PASSWORD_RESPONSE {
		INVALID_PASSWORD = "Sorry, one of your passwords isn't right. Follow the detailed requirements below",
		NOT_AUTHORIZED = 'The email and old password you entered did not match our records. Please double-check and try again',
		PASSWORD_RESET_REQUIRED = 'Password reset is required. Can we help you recover your password?',
		USER_NOT_CONFIRMED = 'The user is not confirmed, please verify your email',
		USER_NOT_FOUND = 'The user is not found. Can we help you register your email?',
	}

	beforeEach(() => {
		cy.loginByCognitoApi();
		cy.getBySel('sidebar-btn-user').click();
		cy.getBySel('user-dropdown-change-password').click();
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
		cy.getBySel('change-password-form-container').click();
		cy.getBySel('form-input-password').eq(0).type('test0');
		cy.getBySel('form-input-password').eq(1).type('test0');
		cy.getBySel('change-password-btn-submit').click();
		cy.getBySel('old-password-error')
			.should('be.visible')
			.and('have.text', AUTH_VALIDATIONS.PASSWORD_INVALID);
		cy.getBySel('password-error-requeriment').eq(0).should('be.visible');
		cy.getBySel('new-password-error')
			.should('be.visible')
			.and('have.text', AUTH_VALIDATIONS.PASSWORD_INVALID);
		cy.getBySel('password-error-requeriment').eq(1).should('be.visible');
	});
	it('Should show an error message when passwords do not match', () => {
		cy.getBySel('change-password-form-container').click();
		cy.getBySel('form-input-password').eq(1).type('test0');
		cy.getBySel('form-input-password').eq(2).type('test1');
		cy.getBySel('change-password-btn-submit').click();
		cy.getBySel('confirm-password-error').contains(
			AUTH_VALIDATIONS.CONFIRM_PASSWORD_NOT_MATCH,
		);
	});
	it('Should show an error message in an alert for the exception InvalidPasswordException', () => {
		cy.getBySel('change-password-form-container').click();
		cy.getBySel('form-input-password').eq(0).type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);
		cy.getBySel('form-input-password').eq(2).type(user.password);

		cy.intercept('POST', cognitoUrl, (req) => {
			req.reply({
				statusCode: 400,
				body: {
					code: 'InvalidPasswordException',
				},
			});
		});
		cy.getBySel('change-password-btn-submit').click();
		cy.getBySel('change-password-error-message-container').should('be.visible');
		cy.getBySel('change-password-error-message-title')
			.should('be.visible')
			.and('have.text', changePassword.alertTitle);
		cy.getBySel('change-password-error-message-info')
			.should('be.visible')
			.and('have.text', CHANGE_PASSWORD_RESPONSE.INVALID_PASSWORD);
	});
	it('Should show an error message in an alert for the exception NotAuthorizedException', () => {
		cy.getBySel('change-password-form-container').click();
		cy.getBySel('form-input-password').eq(0).type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);
		cy.getBySel('form-input-password').eq(2).type(user.password);

		cy.intercept('POST', cognitoUrl, (req) => {
			req.reply({
				statusCode: 400,
				body: {
					code: 'NotAuthorizedException',
				},
			});
		});
		cy.getBySel('change-password-btn-submit').click();
		cy.getBySel('change-password-error-message-container').should('be.visible');
		cy.getBySel('change-password-error-message-title')
			.should('be.visible')
			.and('have.text', changePassword.alertTitle);
		cy.getBySel('change-password-error-message-info')
			.should('be.visible')
			.and('have.text', CHANGE_PASSWORD_RESPONSE.NOT_AUTHORIZED);
	});
	it('Should show an error message in an alert for the exception PasswordResetRequiredException', () => {
		cy.getBySel('change-password-form-container').click();
		cy.getBySel('form-input-password').eq(0).type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);
		cy.getBySel('form-input-password').eq(2).type(user.password);

		cy.intercept('POST', cognitoUrl, (req) => {
			req.reply({
				statusCode: 400,
				body: {
					code: 'PasswordResetRequiredException',
				},
			});
		});
		cy.getBySel('change-password-btn-submit').click();
		cy.getBySel('change-password-error-message-container').should('be.visible');
		cy.getBySel('change-password-error-message-title')
			.should('be.visible')
			.and('have.text', changePassword.alertTitle);
		cy.getBySel('change-password-error-message-info')
			.should('be.visible')
			.and('have.text', CHANGE_PASSWORD_RESPONSE.PASSWORD_RESET_REQUIRED);
	});
	it('Should show an error message in an alert for the exception UserNotConfirmedException', () => {
		cy.getBySel('change-password-form-container').click();
		cy.getBySel('form-input-password').eq(0).type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);
		cy.getBySel('form-input-password').eq(2).type(user.password);

		cy.intercept('POST', cognitoUrl, (req) => {
			req.reply({
				statusCode: 400,
				body: {
					code: 'UserNotConfirmedException',
				},
			});
		});
		cy.getBySel('change-password-btn-submit').click();
		cy.getBySel('change-password-error-message-container').should('be.visible');
		cy.getBySel('change-password-error-message-title')
			.should('be.visible')
			.and('have.text', changePassword.alertTitle);
		cy.getBySel('change-password-error-message-info')
			.should('be.visible')
			.and('have.text', CHANGE_PASSWORD_RESPONSE.USER_NOT_CONFIRMED);
	});
	it('Should show an error message in an alert for the exception UserNotFoundException', () => {
		cy.getBySel('change-password-form-container').click();
		cy.getBySel('form-input-password').eq(0).type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);
		cy.getBySel('form-input-password').eq(2).type(user.password);

		cy.intercept('POST', cognitoUrl, (req) => {
			req.reply({
				statusCode: 400,
				body: {
					code: 'UserNotFoundException',
				},
			});
		});
		cy.getBySel('change-password-btn-submit').click();
		cy.getBySel('change-password-error-message-container').should('be.visible');
		cy.getBySel('change-password-error-message-title')
			.should('be.visible')
			.and('have.text', changePassword.alertTitle);
		cy.getBySel('change-password-error-message-info')
			.should('be.visible')
			.and('have.text', CHANGE_PASSWORD_RESPONSE.USER_NOT_FOUND);
	});
	it('Should show a toast with an error message for the exception InternalErrorException', () => {
		cy.getBySel('change-password-form-container').click();
		cy.getBySel('form-input-password').eq(0).type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);
		cy.getBySel('form-input-password').eq(2).type(user.password);

		cy.intercept('POST', cognitoUrl, (req) => {
			req.reply({
				statusCode: 500,
				body: {
					code: 'InternalErrorException',
				},
			});
		});
		cy.getBySel('change-password-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should show a toast with an error message for the exception InvalidParameterException', () => {
		cy.getBySel('change-password-form-container').click();
		cy.getBySel('form-input-password').eq(0).type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);
		cy.getBySel('form-input-password').eq(2).type(user.password);

		cy.intercept('POST', cognitoUrl, (req) => {
			req.reply({
				statusCode: 500,
				body: {
					code: 'InvalidParameterException',
				},
			});
		});
		cy.getBySel('change-password-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should show a toast with an error message for the exception RequestExpired', () => {
		cy.getBySel('change-password-form-container').click();
		cy.getBySel('form-input-password').eq(0).type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);
		cy.getBySel('form-input-password').eq(2).type(user.password);

		cy.intercept('POST', cognitoUrl, (req) => {
			req.reply({
				statusCode: 500,
				body: {
					code: 'RequestExpired',
				},
			});
		});
		cy.getBySel('change-password-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should show a toast with an error message for the exception ServiceUnavailable', () => {
		cy.getBySel('change-password-form-container').click();
		cy.getBySel('form-input-password').eq(0).type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);
		cy.getBySel('form-input-password').eq(2).type(user.password);

		cy.intercept('POST', cognitoUrl, (req) => {
			req.reply({
				statusCode: 500,
				body: {
					code: 'ServiceUnavailable',
				},
			});
		});
		cy.getBySel('change-password-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should show a toast with an error message for the exception TooManyRequestsException', () => {
		cy.getBySel('change-password-form-container').click();
		cy.getBySel('form-input-password').eq(0).type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);
		cy.getBySel('form-input-password').eq(2).type(user.password);

		cy.intercept('POST', cognitoUrl, (req) => {
			req.reply({
				statusCode: 500,
				body: {
					code: 'TooManyRequestsException',
				},
			});
		});
		cy.getBySel('change-password-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should show an error message by default if it does not match any exception', () => {
		cy.getBySel('change-password-form-container').click();
		cy.getBySel('form-input-password').eq(0).type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);
		cy.getBySel('form-input-password').eq(2).type(user.password);

		cy.intercept('POST', cognitoUrl, (req) => {
			req.reply({
				statusCode: 400,
				body: {
					code: 'DEFAULT',
				},
			});
		});
		cy.getBySel('change-password-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should change a password successfully', () => {
		cy.getBySel('change-password-form-container').click();
		cy.getBySel('form-input-password').eq(0).type(user.password);
		cy.getBySel('form-input-password').eq(1).type(user.password);
		cy.getBySel('form-input-password').eq(2).type(user.password);
		cy.getBySel('change-password-btn-submit').click();
	});
});
