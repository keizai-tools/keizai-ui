describe('Sidebar', () => {
	beforeEach(() => {
		cy.loginByCognitoApi();
		cy.intercept(`${Cypress.env('apiUrl')}/team`, {
			fixture: './teams/all-teams.json',
		}).as('team');
		cy.wait('@team');
	});

	it('Should show the sidebar', () => {
		cy.getBySel('sidebar-container').should('exist').and('be.visible');
		cy.getBySel('sidebar-img')
			.should('be.visible')
			.and('have.attr', 'src', '/logo.svg')
			.and('have.attr', 'alt', 'Keizai Logo');
		cy.getBySel('sidebar-link')
			.should('be.visible')
			.and('have.attr', 'href', '/');
		cy.getBySel('sidebar-btn-copy').should('exist').and('be.visible');
		cy.getBySel('sidebar-btn-setting').should('exist').and('be.visible');
		cy.getBySel('setting-dropdown-container').should('not.exist');
		cy.getBySel('theme-dropdown-container').should('not.exist');
	});
	// We are remvoving the theme selector for now
	it.skip('Should show a dropdown menu to change the theme', () => {
		cy.getBySel('theme-dropdown-btn').click();

		cy.getBySel('theme-dropdown-container').should('exist').and('be.visible');
		cy.getBySel('theme-dropdown-light').should('be.visible').contains('Light');
		cy.getBySel('theme-dropdown-dark').should('be.visible').contains('Dark');
		cy.getBySel('theme-dropdown-system')
			.should('be.visible')
			.contains('System');

		cy.getBySel('theme-dropdown-btn').click({ force: true });
		cy.getBySel('theme-dropdown-container').should('not.exist');
	});
	it('Should show the user dropdown menu', () => {
		cy.intercept(`${Cypress.env('apiUrl')}/collection`, { body: [] }).as(
			'Collection',
		);

		cy.getBySel('sidebar-container').should('exist').and('be.visible');
		cy.getBySel('sidebar-btn-user').should('not.exist');

		cy.getBySel('home-workspace-list-user').should('be.visible').click();
		cy.wait('@Collection');
		cy.url().should('includes', '/user');
		cy.getBySel('sidebar-btn-user').should('exist');
		cy.getBySel('sidebar-link').click();
		cy.getBySel('sidebar-btn-user').should('not.exist');

		cy.getBySel('home-workspace-list-team').eq(0).should('be.visible').click();
		cy.wait('@Collection');
		cy.url().should('includes', '/team');
		cy.getBySel('sidebar-btn-user').should('exist');
		cy.getBySel('sidebar-link').click();
		cy.getBySel('sidebar-btn-user').should('not.exist');
	});
	it('Should navigate between collections using the user dropdown menu and show checked item', () => {
		cy.intercept(`${Cypress.env('apiUrl')}/collection`, { body: [] }).as(
			'Collection',
		);

		cy.getBySel('sidebar-container').should('exist').and('be.visible');
		cy.getBySel('home-workspace-list-user').should('be.visible').click();
		cy.wait('@Collection');
		cy.url().should('includes', '/user');

		cy.getBySel('sidebar-btn-user').click();
		cy.getBySel('user-dropdown-container').should('exist').and('be.visible');
		cy.getBySel('user-dropdown-user-item')
			.find('span.absolute > span')
			.should('exist')
			.and('be.visible');
		cy.getBySel('user-dropdown-team-item')
			.find('span.absolute > span')
			.should('not.exist');

		cy.getBySel('user-dropdown-team-item').click();
		cy.getBySel('user-dropdown-container').should('not.exist');
		cy.url().should('includes', '/team');
		cy.getBySel('sidebar-btn-user').click();
		cy.getBySel('user-dropdown-container').should('exist').and('be.visible');
		cy.getBySel('user-dropdown-team-item')
			.find('span.absolute > span')
			.eq(0)
			.should('exist')
			.and('be.visible');
		cy.getBySel('user-dropdown-user-item')
			.find('span.absolute > span')
			.should('not.exist');
	});
	it('Should disconnect from the session', () => {
		cy.getBySel('sidebar-container').should('exist').and('be.visible');
		cy.getBySel('login-form-container').should('not.exist');
		cy.getBySel('sidebar-btn-setting').click();
		cy.getBySel('setting-dropdown-log-out').click();
		cy.url().should('include', `${Cypress.env('loginUrl')}`);
		cy.getBySel('login-form-container').should('exist').and('be.visible');
		cy.getBySel('sidebar-container').should('not.exist');
	});
});
