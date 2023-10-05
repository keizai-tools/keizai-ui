describe('Home page', () => {
	beforeEach(() => {
		cy.visit('/');
	});

	it('Should show a Breadcrumb', () => {
		const contractName = 'Counter contract / Basic use case /';

		cy.getBySel('breadcrumb-container').should('exist').and('be.visible');
		cy.getBySel('breadcrumb-contract-name').should(
			'contain.text',
			contractName,
		);
		cy.getBySel('breadcrumb-contract-invocation-name').should(
			'contain.text',
			'Get current counter',
		);
	});
	it('Should show a contract input', () => {
		const contractId =
			'f47e3e34187dc84aa9ff41108082d289cdf6e40720cdfba8fcd9974369b9d32e';

		cy.getBySel('contract-input-container').should('exist').and('be.visible');
		cy.getBySel('contract-input-network')
			.should('be.visible')
			.and('have.text', 'FUTURENET');
		cy.getBySel('input-contract-name')
			.should('be.visible')
			.and('have.value', contractId);
		cy.getBySel('contract-input-btn-load')
			.should('be.visible')
			.and('have.text', 'LOAD');
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
