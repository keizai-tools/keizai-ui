// https://docs.cypress.io/guides/overview/why-cypress
describe('Home page', () => {
	beforeEach(() => {
		cy.visit('/');
	});

	it('Should render correctly', () => {
		cy.getBySel('home-msg')
			.should('be.visible')
			.and('have.text', 'This is the homepage!');
	});
});
