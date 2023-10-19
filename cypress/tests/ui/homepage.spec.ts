describe('Home page', () => {
	beforeEach(() => {
		cy.loginByCognitoApi();
		cy.visit('/');
	});

	describe('Collections Page', () => {
		it('Should show the collections page', () => {
			cy.getBySel('collections-header-title').should('exist').and('be.visible');
			cy.getBySel('home-page-container').should('not.exist');
		});
		it('Should redirect to the Home page when navigating to other paths', () => {
			cy.visit('/aaa');
			cy.getBySel('collections-header-title').should('be.visible');
		});
	});
});
