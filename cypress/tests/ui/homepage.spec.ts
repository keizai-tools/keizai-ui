// https://docs.cypress.io/guides/overview/why-cypress
describe('Home page', () => {
	beforeEach(() => {
		cy.visit('/');
	});

	it('Should show a title', () => {
		cy.getBySel('home-msg')
			.should('be.visible')
			.and('have.text', 'Keizai Homes');
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
