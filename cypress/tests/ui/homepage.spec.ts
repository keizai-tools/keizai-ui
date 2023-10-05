describe('Home page', () => {
	beforeEach(() => {
		cy.visit('/');
	});

	it('Should show a Collections component', () => {
		cy.getBySel('collections-container').should('exist').and('be.visible');
		cy.getBySel('collections-header').should('exist').and('be.visible');
		cy.getBySel('collections-header-title')
			.should('be.visible')
			.and('have.text', 'Collections');
		cy.getBySel('collections-header-btn-new')
			.should('be.visible')
			.and('have.text', 'New');
		cy.getBySel('collections-header-btn-import')
			.should('be.visible')
			.and('have.text', 'Import');
		cy.getBySel('collections-accordion-container')
			.should('exist')
			.and('be.visible');
    });
	it('Should redirect to the Home page when navigating to other paths', () => {
		cy.visit('/aaa');
		cy.getBySel('home-msg')
			.should('be.visible')
			.and('have.text', 'Keizai Homes');

		cy.visit('/bbb');
		cy.getBySel('home-msg')
			.should('be.visible')
			.and('have.text', 'Keizai Homes');

		cy.visit('/ccc');
		cy.getBySel('home-msg')
			.should('be.visible')
			.and('have.text', 'Keizai Homes');
	});
});
