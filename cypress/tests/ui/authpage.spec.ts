describe('Authentication page management', () => {
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

	describe('Login', () => {
		const loginForm = {
			title: 'Welcome Back',
			username: 'Email',
			password: 'Password',
			btnSubmit: 'Login',
			footer: {
				info: "Don't have an account?",
				loginLink: {
					title: 'Join now',
					url: '/register',
				},
				passwordLink: {
					title: 'Forgot your password?',
					url: '/forgot-password',
				},
			},
			errors: {
				failedLogin: 'Invalid email or password',
			},
		};
		beforeEach(() => {
			cy.visit(`${Cypress.env('loginUrl')}`);
		});
		it('Should show a login form', () => {
			cy.getBySel('auth-page-container').should('exist').and('be.visible');
			cy.getBySel('auth-page-banner-container')
				.should('exist')
				.and('be.visible');
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
		it('Should go to the login form', () => {
			cy.url().should('include', `${Cypress.env('loginUrl')}`);
			cy.getBySel('login-form-container').should('exist').and('be.visible');
			cy.getBySel('register-form-container').should('not.exist');
			cy.getBySel('login-form-footer-register-link').click();
			cy.url().should('include', `${Cypress.env('registerUrl')}`);
			cy.getBySel('register-form-container').should('exist').and('be.visible');
			cy.getBySel('login-form-container').should('not.exist');
		});
		it('Should show an error message when type invalid email or password', () => {
			cy.getBySel('login-form-email').type(user.username);
			cy.getBySel('form-input-password').type('test');
			cy.getBySel('login-form-btn-submit').click();
			cy.wait(500);
			cy.getBySel('login-form-error-message')
				.should('be.visible')
				.and('have.text', loginForm.errors.failedLogin);
		});
		it('Should log in', () => {
			cy.getBySel('login-form-email').type(user.username);
			cy.getBySel('form-input-password').type(user.password);
			cy.getBySel('login-form-btn-submit').click();
			cy.url().should('not.include', `${Cypress.env('loginUrl')}`);
		});
	});
	describe('Register', () => {
		const registerForm = {
			title: 'Create Account',
			email: 'Email',
			password: 'Password',
			btnSubmit: 'Create',
			footer: {
				info: 'Already have an account?',
				link: { title: 'Log in', url: '/login' },
			},
			erros: {
				emailInvalid: 'Invalid email address',
				emailExist: 'The email is already registered',
				invalidPassword:
					'The password must consist of at least 8 alphanumeric characters and alternate between uppercase, lowercase, and special characters',
			},
		};
		beforeEach(() => {
			cy.visit(`${Cypress.env('registerUrl')}`);
		});
		it('Should show a register form', () => {
			cy.getBySel('auth-page-container').should('exist').and('be.visible');
			cy.getBySel('auth-page-banner-container')
				.should('exist')
				.and('be.visible');
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
		it('Should show an error message when type invalid email', () => {
			cy.getBySel('register-form-email').type('test');
			cy.getBySel('form-input-password').type(user.password);
			cy.getBySel('register-form-btn-submit').click();
			cy.getBySel('register-form-email-error')
				.should('be.visible')
				.and('contain', registerForm.erros.emailInvalid);
		});
		it('Should show an error message when the password does not meet the required pattern', () => {
			cy.getBySel('register-form-email').type(user.username);
			cy.getBySel('form-input-password').type('test');
			cy.getBySel('register-form-btn-submit').click();
			cy.getBySel('register-form-password-error')
				.should('be.visible')
				.and('contain', registerForm.erros.invalidPassword);
		});
		it('Should show an error message when the email already exists', () => {
			cy.getBySel('register-form-email').type(user.username);
			cy.getBySel('form-input-password').type(user.password);
			cy.getBySel('register-form-btn-submit').click();
			cy.wait(500);
			cy.getBySel('register-form-create-error')
				.should('be.visible')
				.and('contain', registerForm.erros.emailExist);
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
	describe('Reset password', () => {
		const paswordForm = {
			recovery: {
				title: 'Password Recovery',
				username: 'Email',
				btnSubmit: 'Send code',
			},
			forgot: {
				title: 'Password Reset',
				code: 'Code',
				newPassword: 'New Password',
				confirmPassword: 'Confirm New Password',
				btnSubmit: 'Login',
				footer: {
					info: 'Already have an account?',
					link: {
						title: 'Log In',
						url: '/login',
					},
				},
				erros: {
					invalidPassword:
						'The password must consist of at least 8 alphanumeric characters and alternate between uppercase, lowercase, and special characters',
				},
			},
		};

		beforeEach(() => {
			cy.visit(`${Cypress.env('loginUrl')}`);
			cy.getBySel('login-form-footer-password-link').click();
		});
		it('Should show a recovery password form', () => {
			cy.getBySel('auth-page-container').should('exist').and('be.visible');
			cy.getBySel('auth-page-banner-container')
				.should('exist')
				.and('be.visible');
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
				.contains(paswordForm.recovery.title);
			cy.getBySel('recovery-password-email-send-code')
				.should('be.visible')
				.and('have.attr', 'placeholder', paswordForm.recovery.username);
			cy.getBySel('recovery-password-btn-submit')
				.should('be.visible')
				.and('have.text', paswordForm.recovery.btnSubmit);
		});
		it('Should show a forgot password form', () => {
			const response = 'SUCCESS';
			cy.intercept('POST', `${Cypress.env('cognitoEndpoint')}`, response);
			cy.getBySel('recovery-password-email-send-code').type(user.username);
			cy.getBySel('recovery-password-btn-submit').click();

			cy.getBySel('auth-page-container').should('exist').and('be.visible');
			cy.getBySel('auth-page-banner-container')
				.should('exist')
				.and('be.visible');
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
				.contains(paswordForm.forgot.title);
			cy.getBySel('forgot-password-code')
				.should('be.visible')
				.and('have.attr', 'placeholder', paswordForm.forgot.code);
			cy.getBySel('form-input-password')
				.eq(0)
				.should('be.visible')
				.and('have.attr', 'placeholder', paswordForm.forgot.newPassword);
			cy.getBySel('form-input-password')
				.eq(1)
				.should('be.visible')
				.and('have.attr', 'placeholder', paswordForm.forgot.confirmPassword);
			cy.getBySel('forgot-password-btn-submit')
				.should('be.visible')
				.contains(paswordForm.forgot.btnSubmit);
			cy.getBySel('forgot-password-footer-info')
				.should('be.visible')
				.contains(paswordForm.forgot.footer.info);
			cy.getBySel('forgot-password-footer-link')
				.should('be.visible')
				.and('have.attr', 'href', paswordForm.forgot.footer.link.url)
				.contains(paswordForm.forgot.footer.link.title);
		});
		it('Should show an error message when the password does not meet the required pattern', () => {
			const response = 'SUCCESS';
			cy.intercept('POST', `${Cypress.env('cognitoEndpoint')}`, response);

			cy.getBySel('recovery-password-email-send-code').type(user.username);
			cy.getBySel('recovery-password-btn-submit').click();
			cy.getBySel('form-input-password').eq(0).type('test');
			cy.getBySel('forgot-password-btn-submit').click();

			cy.getBySel('forgot-password-error-message')
				.should('be.visible')
				.and('have.text', paswordForm.forgot.erros.invalidPassword);
		});
		it('Should recover the account, resetting password', () => {
			const code = '369401';
			const response = 'SUCCESS';
			cy.intercept('POST', `${Cypress.env('cognitoEndpoint')}`, response);

			cy.getBySel('recovery-password-email-send-code').type(user.username);
			cy.getBySel('recovery-password-btn-submit').click();

			cy.getBySel('forgot-password-code').type(code);

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
	describe('Change password', () => {
		const changePassword = {
			title: 'Change Password',
			oldPassword: 'Old Password',
			newPassword: 'New Password',
			confirmPassword: 'Confirm New Password',
			btnSubmit: 'Update password',
			error: 'Unable to change password, please try again',
		};
		const validateErrors = {
			required: 'is required',
			notMatch: 'Passwords do not match',
		};

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
			cy.getBySel('old-password-error').contains(validateErrors.required);
			cy.getBySel('new-password-error').contains(validateErrors.required);
			cy.getBySel('confirm-password-error').contains(validateErrors.required);
		});
		it('Should show an error message when passwords do not match', () => {
			cy.getBySel('form-input-password').eq(1).type('test0');
			cy.getBySel('form-input-password').eq(2).type('test1');
			cy.getBySel('change-password-btn-submit').click();
			cy.getBySel('confirm-password-error').contains(validateErrors.notMatch);
		});
		it('Should change a password successfully', () => {
			cy.getBySel('change-password-form-container').click();
			cy.getBySel('form-input-password').eq(0).type(user.password);
			cy.getBySel('form-input-password').eq(1).type(user.password);
			cy.getBySel('form-input-password').eq(2).type(user.password);
			cy.getBySel('change-password-btn-submit').click();
		});
	});
});
