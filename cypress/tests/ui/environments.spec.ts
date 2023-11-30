import { collectionId } from './exceptions/contants';

describe('Environments management', () => {
	const environments = {
		linkName: 'Collection variables',
		header: {
			title: 'Collections variables',
			collectionName: 'Collection 1',
		},
		button: {
			addName: 'Add new',
			saveName: 'Save',
		},
		input: {
			namePlaceholder: 'Name',
			valuePlaceholder: 'Value',
		},
	};

	beforeEach(() => {
		cy.loginByCognitoApi();
		cy.intercept('GET', `${Cypress.env('apiUrl')}/collection`, {
			fixture: './environments/collection-without-env.json',
		}).as('getCollections');
		cy.wait('@getCollections');
		cy.getBySel('collection-folder-btn').click();
	});

	it('Should show collection variables link', () => {
		cy.intercept(
			'GET',
			`${Cypress.env('apiUrl')}/collection/${collectionId}/folders`,
			{ fixture: './environments/folder-with-contract-id.json' },
		);
		cy.getBySel('collections-variables-btn-link').should(
			'have.text',
			environments.linkName,
		);
	});
	it('Should navigate to the collection variables', () => {
		cy.intercept('GET', `${Cypress.env('apiUrl')}/collection/${collectionId}`, {
			fixture: './environments/one-collection-with-contract-id.json',
		}).as('getCollection');
		cy.intercept('GET', `${Cypress.env('apiUrl')}/enviroment`, { body: [] }).as(
			'getEnvironments',
		);
		cy.getBySel('collections-variables-btn-link').click();
		cy.url().should('include', '/variables');
		cy.getBySel('collection-variables-container').should('be.visible');
		cy.getBySel('collection-variables-title')
			.should('be.visible')
			.and('have.text', environments.header.title);
		cy.getBySel('collection-variables-collection-name')
			.should('be.visible')
			.and('have.text', environments.header.collectionName);
		cy.getBySel('collection-variables-btn-add')
			.should('be.visible')
			.and('have.text', environments.button.addName);
		cy.getBySel('collection-variables-input-container').should('not.exist');
		cy.getBySel('collection-variables-btn-save')
			.should('be.visible')
			.and('have.text', environments.button.saveName);
	});
});
