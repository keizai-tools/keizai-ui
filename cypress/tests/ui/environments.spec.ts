import { environments } from './exceptions/constants';
import { collectionId } from './exceptions/contants';

describe('Environments management', () => {
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
	it('Should navigate to the collection variables without variables', () => {
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
	it('Should navigate to the collection variables with a variable', () => {
		cy.intercept('GET', `${Cypress.env('apiUrl')}/collection/${collectionId}`, {
			fixture: './environments/one-collection-with-contract-id.json',
		}).as('getCollection');
		cy.intercept('GET', `${Cypress.env('apiUrl')}/enviroment`, {
			fixture: './environments/environments-one-length.json',
		}).as('getEnvironments');

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
		cy.getBySel('collection-variables-input-container').should('be.visible');
		cy.getBySel('collection-variables-input-name')
			.should('be.visible')
			.and('have.attr', 'placeholder', environments.input.namePlaceholder);
		cy.getBySel('collection-variables-input-value')
			.should('be.visible')
			.and('have.attr', 'placeholder', environments.input.valuePlaceholder);
		cy.getBySel('collection-variables-btn-delete').should('be.visible');
		cy.getBySel('collection-variables-btn-save')
			.should('be.visible')
			.and('have.text', environments.button.saveName);
	});
	it('Should show an error toast when creating a variable', () => {
		cy.intercept('GET', `${Cypress.env('apiUrl')}/collection/${collectionId}`, {
			fixture: './environments/one-collection-with-contract-id.json',
		}).as('getCollection');
		cy.intercept('GET', `${Cypress.env('apiUrl')}/enviroment`, { body: [] }).as(
			'getEnvironments',
		);
		cy.intercept('POST', `${Cypress.env('apiUrl')}/enviroment`, {
			statusCode: 400,
		}).as('postEnvironment');

		cy.getBySel('collections-variables-btn-link').click();
		cy.url().should('include', '/variables');
		cy.getBySel('collection-variables-container').should('be.visible');
		cy.getBySel('collection-variables-input-container').should('not.exist');
		cy.getBySel('collection-variables-btn-add').click();
		cy.getBySel('collection-variables-input-container').should('be.visible');
		cy.getBySel('collection-variables-input-name')
			.should('be.visible')
			.type(environments.input.key);
		cy.getBySel('collection-variables-input-value')
			.should('be.visible')
			.type(environments.input.value);
		cy.getBySel('collection-variables-btn-save').click();
		cy.wait('@postEnvironment');
		cy.getBySel('toast-container').should('exist').and('be.visible');
	});
	it('Should create a new variable successfully', () => {
		cy.intercept('GET', `${Cypress.env('apiUrl')}/collection/${collectionId}`, {
			fixture: './environments/one-collection-with-contract-id.json',
		}).as('getCollection');
		cy.intercept('GET', `${Cypress.env('apiUrl')}/enviroment`, { body: [] }).as(
			'getEnvironments',
		);
		cy.getBySel('collections-variables-btn-link').click();
		cy.url().should('include', '/variables');
		cy.getBySel('collection-variables-container').should('be.visible');

		cy.intercept('POST', `${Cypress.env('apiUrl')}/enviroment`, {
			fixture: './environments/one-environment.json',
		}).as('postEnvironment');
		cy.intercept('GET', `${Cypress.env('apiUrl')}/enviroment`, {
			fixture: './environments/environments-one-length.json',
		}).as('getEnvironments');

		cy.getBySel('collection-variables-input-container').should('not.exist');
		cy.getBySel('collection-variables-btn-add').click();
		cy.getBySel('collection-variables-input-container').should('be.visible');
		cy.getBySel('collection-variables-input-name')
			.should('be.visible')
			.type(environments.input.key);
		cy.getBySel('collection-variables-input-value')
			.should('be.visible')
			.type(environments.input.value);
		cy.getBySel('collection-variables-btn-save').click();
		cy.wait('@postEnvironment');
		cy.getBySel('toast-container').should('exist').and('be.visible');
	});
	it('Should show an error toast when editing a variable', () => {
		cy.intercept('GET', `${Cypress.env('apiUrl')}/collection/${collectionId}`, {
			fixture: './environments/one-collection-with-contract-id.json',
		}).as('getCollection');
		cy.intercept('GET', `${Cypress.env('apiUrl')}/enviroment`, {
			fixture: './environments/environments-one-length.json',
		}).as('getEnvironments');
		cy.intercept('PATCH', `${Cypress.env('apiUrl')}/enviroment`, {
			statusCode: 400,
		}).as('editEnvironments');

		cy.getBySel('collections-variables-btn-link').click();
		cy.getBySel('collection-variables-input-value').clear();
		cy.getBySel('collection-variables-input-name')
			.should('be.visible')
			.type(environments.input.editedKey);
		cy.wait('@editEnvironments');
		cy.getBySel('toast-container').should('exist').and('be.visible');
	});
	it('Should edit a variable successfully', () => {
		cy.intercept('GET', `${Cypress.env('apiUrl')}/collection/${collectionId}`, {
			fixture: './environments/one-collection-with-contract-id.json',
		}).as('getCollection');
		cy.intercept('GET', `${Cypress.env('apiUrl')}/enviroment`, {
			fixture: './environments/environments-one-length.json',
		}).as('getEnvironments');
		cy.getBySel('collections-variables-btn-link').click();

		cy.intercept('PATCH', `${Cypress.env('apiUrl')}/enviroment`, {
			fixture: './environments/edited-environment.json',
		}).as('editEnvironments');
		cy.intercept('GET', `${Cypress.env('apiUrl')}/enviroment`, {
			fixture: './environments/environments-one-length.json',
		}).as('getEnvironments');

		cy.getBySel('collection-variables-input-name').clear();
		cy.getBySel('collection-variables-input-value').clear();

		cy.getBySel('collection-variables-input-name')
			.should('be.visible')
			.type(environments.input.editedKey);
		cy.getBySel('collection-variables-input-value')
			.should('be.visible')
			.type(environments.input.editedValue);
		cy.wait('@editEnvironments');
		cy.reload();

		cy.getBySel('collection-variables-input-name')
			.should('be.visible')
			.should('have.value', environments.input.editedKey);
		cy.getBySel('collection-variables-input-value')
			.should('be.visible')
			.should('have.value', environments.input.editedValue);
	});
	it('Should show an error toast when deleting a variable', () => {
		cy.intercept('GET', `${Cypress.env('apiUrl')}/collection/${collectionId}`, {
			fixture: './environments/one-collection-with-contract-id.json',
		}).as('getCollection');
		cy.intercept('GET', `${Cypress.env('apiUrl')}/enviroment`, {
			fixture: './environments/environments-one-length.json',
		}).as('getEnvironments');
		cy.intercept(
			'DELETE',
			`${Cypress.env('apiUrl')}/enviroment/${environments.id}`,
			{
				statusCode: 400,
			},
		);

		cy.getBySel('collections-variables-btn-link').click();
		cy.getBySel('collection-variables-input-container').should('be.visible');
		cy.getBySel('collection-variables-btn-delete').click();
		cy.getBySel('toast-container').should('exist').and('be.visible');
	});
	it('Should delete a variable successfully', () => {
		cy.intercept('GET', `${Cypress.env('apiUrl')}/collection/${collectionId}`, {
			fixture: './environments/one-collection-with-contract-id.json',
		}).as('getCollection');
		cy.intercept('GET', `${Cypress.env('apiUrl')}/enviroment`, {
			fixture: './environments/environments-one-length.json',
		}).as('getEnvironments');

		cy.getBySel('collections-variables-btn-link').click();
		cy.getBySel('collection-variables-input-container').should('be.visible');
		cy.getBySel('collection-variables-btn-delete').click();

		cy.intercept(
			'DELETE',
			`${Cypress.env('apiUrl')}/enviroment/${environments.id}`,
			{
				body: {
					id: environments.id,
				},
			},
		).as('deleteEnvironment');
		cy.intercept('GET', `${Cypress.env('apiUrl')}/enviroment`, { body: [] }).as(
			'getEnvironments',
		);

		cy.wait('@deleteEnvironment');
		cy.getBySel('collection-variables-input-container').should('not.exist');
	});
});
