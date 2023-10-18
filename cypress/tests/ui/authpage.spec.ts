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
				link: {
					title: 'Join now',
					url: '/register',
				},
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
			cy.getBySel('login-form-footer-link')
				.should('be.visible')
				.and('have.attr', 'href', loginForm.footer.link.url)
				.contains(loginForm.footer.link.title);
		});
		it('Should go to the login form', () => {
			cy.url().should('include', `${Cypress.env('loginUrl')}`);
			cy.getBySel('login-form-container').should('exist').and('be.visible');
			cy.getBySel('register-form-container').should('not.exist');
			cy.getBySel('login-form-footer-link').click();
			cy.url().should('include', `${Cypress.env('registerUrl')}`);
			cy.getBySel('register-form-container').should('exist').and('be.visible');
			cy.getBySel('login-form-container').should('not.exist');
		});
		it('Should log in', () => {
			cy.getBySel('login-form-email').type(user.username);
			cy.getBySel('form-input-password').type(user.password);
			cy.getBySel('login-form-btn-submit').click();
			cy.url().should('not.include', `${Cypress.env('loginUrl')}`);
			cy.getBySel('invocation-page-container')
				.should('exist')
				.and('be.visible');
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
});
