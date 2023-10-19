describe('Collections', () => {
	beforeEach(() => {
		cy.loginByCognitoApi();
		cy.visit('/');
	});

	it('Should show the Collections header', () => {
		cy.getBySel('home-page-container').should('not.exist');
		cy.getBySel('collections-accordion-item').should('not.exist');
		cy.getBySel('collections-header-title')
			.should('be.visible')
			.and('have.text', 'Collections');
		cy.getBySel('collections-header-btn-new')
			.should('be.visible')
			.and('have.text', 'Create a new collection');
	});
});
