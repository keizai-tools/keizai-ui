import { homePage } from './exceptions/constants';

describe('Home Page', () => {
	beforeEach(() => {
		cy.loginByCognitoApi();
	});
	it("Should show the home page with the user's personal account without teams", () => {
		cy.intercept(`${Cypress.env('apiUrl')}/team`, { body: [] }).as('team');
		cy.wait('@team');

		cy.getBySel('home-page-container').should('exist').and('be.visible');
		cy.getBySel('home-header-title')
			.should('be.visible')
			.and('have.text', homePage.title);
		cy.getBySel('home-workspace-list-container')
			.should('exist')
			.and('be.visible');
		cy.getBySel('home-workspace-list-user')
			.should('be.visible')
			.and('have.text', homePage.list[0]);
		cy.getBySel('home-workspace-list-team').should('not.exist');
	});
	it("Should show the home page with the user's personal account and teams", () => {
		cy.intercept(`${Cypress.env('apiUrl')}/team`, {
			fixture: './teams/all-teams.json',
		}).as('team');
		cy.wait('@team');

		cy.getBySel('home-page-container').should('exist').and('be.visible');
		cy.getBySel('home-header-title')
			.should('be.visible')
			.and('have.text', homePage.title);
		cy.getBySel('home-workspace-list-container')
			.should('exist')
			.and('be.visible');
		cy.getBySel('home-workspace-list-user')
			.should('be.visible')
			.and('have.text', homePage.list[0]);
		cy.getBySel('home-workspace-list-team')
			.should('be.visible')
			.and('have.text', homePage.list[1]);
	});
	it('Should redirect to the Home page when navigating to other paths', () => {
		cy.intercept(`${Cypress.env('apiUrl')}/team`, { body: [] }).as('team');
		cy.wait('@team');

		cy.visit('/test');
		cy.getBySel('home-page-container').should('not.exist');
		cy.getBySel('home-header-title')
			.should('be.visible')
			.and('have.text', homePage.title);
		cy.url().should('not.include', '/test');
	});
});
