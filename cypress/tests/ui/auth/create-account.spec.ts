describe('Register', () => {
	const registerForm = {
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
	const apiUrl = `${Cypress.env('apiUrl')}/auth/register`;
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
	enum INPUT_VALIDATOR {
		EMAIL_INVALID = 'Enter in the format: name@example.com',
		EMAIL_REQUIRED = 'Email is required',
		PASSWORD_INVALID = 'Your password must be at least',
		PASSWORD_REQUIRED = 'Password is required',
	}
	enum CREATE_ACCOUNT_RESPONSE {
		INVALID_PASSWORD = "Sorry, that password isn't right. Follow the detailed requirements below",
		NOT_AUTHORIZED = 'There was an error creating your account, please try again',
		USERNAME_EXIST = 'Another user with this email already exists. Can we help you recover your email or reset the password?',
	}

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
			.and('have.text', INPUT_VALIDATOR.EMAIL_REQUIRED);
		cy.getBySel('register-form-password-error')
			.should('be.visible')
			.and('have.text', INPUT_VALIDATOR.PASSWORD_REQUIRED);
	});
	it('Should show an error message when the email and password are invalid', () => {
		cy.getBySel('register-form-email').type(registerForm.invalidField);
		cy.getBySel('form-input-password').type(registerForm.invalidField);
		cy.getBySel('register-form-btn-submit').click();
		cy.getBySel('register-form-email-error')
			.should('be.visible')
			.and('have.text', INPUT_VALIDATOR.EMAIL_INVALID);
		cy.getBySel('register-form-password-error')
			.should('be.visible')
			.and('have.text', INPUT_VALIDATOR.PASSWORD_INVALID);
		cy.getBySel('password-error-requeriment').should('be.visible');
	});
	it('Should show an error message in an alert for the exception InvalidPasswordException', () => {
		cy.getBySel('register-form-email').type(user.username);
		cy.getBySel('form-input-password').type(user.password);

		cy.intercept('POST', apiUrl, (req) => {
			req.reply({
				statusCode: 400,
				body: {
					code: 'InvalidPasswordException',
				},
			});
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
		cy.getBySel('register-form-email').type(user.username);
		cy.getBySel('form-input-password').type(user.password);

		cy.intercept('POST', apiUrl, (req) => {
			req.reply({
				statusCode: 400,
				body: {
					code: 'NotAuthorizedException',
				},
			});
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
	it('Should show an error message in an alert for the exception UsernameExistsException', () => {
		cy.getBySel('register-form-email').type(user.username);
		cy.getBySel('form-input-password').type(user.password);

		cy.intercept('POST', apiUrl, (req) => {
			req.reply({
				statusCode: 400,
				body: {
					code: 'UsernameExistsException',
				},
			});
		});
		cy.getBySel('register-form-btn-submit').click();
		cy.getBySel('register-form-create-error-container').should('be.visible');
		cy.getBySel('register-form-create-error-title')
			.should('be.visible')
			.and('have.text', registerForm.alertTitle);
		cy.getBySel('register-form-create-error-info')
			.should('be.visible')
			.and('have.text', CREATE_ACCOUNT_RESPONSE.USERNAME_EXIST);
	});
	it('Should show a toast with an error message for the exception InternalErrorException', () => {
		cy.getBySel('register-form-email').type(user.username);
		cy.getBySel('form-input-password').type(user.password);

		cy.intercept('POST', apiUrl, (req) => {
			req.reply({
				statusCode: 500,
				body: {
					code: 'InternalErrorException',
				},
			});
		});
		cy.getBySel('register-form-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should show a toast with an error message for the exception InvalidParameterException', () => {
		cy.getBySel('register-form-email').type(user.username);
		cy.getBySel('form-input-password').type(user.password);

		cy.intercept('POST', apiUrl, (req) => {
			req.reply({
				statusCode: 500,
				body: {
					code: 'InvalidParameterException',
				},
			});
		});
		cy.getBySel('register-form-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should show a toast with an error message for the exception RequestExpired', () => {
		cy.getBySel('register-form-email').type(user.username);
		cy.getBySel('form-input-password').type(user.password);

		cy.intercept('POST', apiUrl, (req) => {
			req.reply({
				statusCode: 500,
				body: {
					code: 'RequestExpired',
				},
			});
		});
		cy.getBySel('register-form-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should show a toast with an error message for the exception ServiceUnavailable', () => {
		cy.getBySel('register-form-email').type(user.username);
		cy.getBySel('form-input-password').type(user.password);

		cy.intercept('POST', apiUrl, (req) => {
			req.reply({
				statusCode: 500,
				body: {
					code: 'ServiceUnavailable',
				},
			});
		});
		cy.getBySel('register-form-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should show a toast with an error message for the exception TooManyRequestsException', () => {
		cy.getBySel('register-form-email').type(user.username);
		cy.getBySel('form-input-password').type(user.password);

		cy.intercept('POST', apiUrl, (req) => {
			req.reply({
				statusCode: 500,
				body: {
					code: 'TooManyRequestsException',
				},
			});
		});
		cy.getBySel('register-form-btn-submit').click();
		cy.getBySel('toast-container').should('be.visible');
	});
	it('Should show an error message by default if it does not match any exception', () => {
		cy.getBySel('register-form-email').type(user.username);
		cy.getBySel('form-input-password').type(user.password);

		cy.intercept('POST', apiUrl, (req) => {
			req.reply({
				statusCode: 500,
				body: {
					code: 'default',
				},
			});
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
