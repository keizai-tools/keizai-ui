import { environments } from './exceptions/constants';
import { collectionId } from './exceptions/contants';

describe('Environments management', () => {
	beforeEach(() => {
		cy.loginByCognitoApi();
		cy.intercept('GET', `${Cypress.env('apiUrl')}/collection`, {
			fixture: './environments/collection-without-env.json',
		}).as('getCollections');
		cy.wait('@getCollections');
	});
	describe('Environment page without variables', () => {
		beforeEach(() => {
			cy.intercept(
				'GET',
				`${Cypress.env('apiUrl')}/collection/*/environments`,
				{
					body: [],
				},
			).as('getEnvironments');
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
		it('Should navigate to the collection variables  without variables', () => {
			cy.intercept(
				'GET',
				`${Cypress.env('apiUrl')}/collection/${collectionId}`,
				{
					fixture: './environments/one-collection-with-contract-id.json',
				},
			).as('getCollection');
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
		it('Should show an error toast when creating a variable', () => {
			cy.intercept(
				'GET',
				`${Cypress.env('apiUrl')}/collection/${collectionId}`,
				{
					fixture: './environments/one-collection-with-contract-id.json',
				},
			).as('getCollection');
			cy.intercept('POST', `${Cypress.env('apiUrl')}/environment`, {
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
			cy.intercept(
				'GET',
				`${Cypress.env('apiUrl')}/collection/${collectionId}`,
				{
					fixture: './environments/one-collection-with-contract-id.json',
				},
			).as('getCollection');
			cy.intercept('POST', `${Cypress.env('apiUrl')}/environment`, {
				fixture: './environments/one-environment.json',
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
	});
	describe('Environment page with variables', () => {
		beforeEach(() => {
			cy.intercept(
				'GET',
				`${Cypress.env('apiUrl')}/collection/*/environments`,
				{
					fixture: './environments/environments-one-length.json',
				},
			).as('getEnvironments');
			cy.getBySel('collection-folder-btn').click();
		});
		it('Should navigate to the collection variables with a variable', () => {
			cy.intercept(
				'GET',
				`${Cypress.env('apiUrl')}/collection/${collectionId}`,
				{
					fixture: './environments/one-collection-with-contract-id.json',
				},
			).as('getCollection');

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
		it('Should show an error toast when editing a variable', () => {
			cy.intercept(
				'GET',
				`${Cypress.env('apiUrl')}/collection/${collectionId}`,
				{
					fixture: './environments/one-collection-with-contract-id.json',
				},
			).as('getCollection');
			cy.intercept('PATCH', `${Cypress.env('apiUrl')}/environment`, {
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
			cy.intercept(
				'GET',
				`${Cypress.env('apiUrl')}/collection/${collectionId}`,
				{
					fixture: './environments/one-collection-with-contract-id.json',
				},
			).as('getCollection');
			cy.intercept('PATCH', `${Cypress.env('apiUrl')}/environment`, {
				fixture: './environments/edited-environment.json',
			}).as('editEnvironments');
			cy.intercept(
				'GET',
				`${Cypress.env('apiUrl')}/collection/*/environments`,
				{
					fixture: './environments/edited-environment.json',
				},
			).as('getEnvironments');
			cy.getBySel('collections-variables-btn-link').click();

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

			cy.wait('@getEnvironments');
			cy.getBySel('collection-variables-input-name')
				.should('be.visible')
				.should('have.value', environments.input.editedKey);
			cy.getBySel('collection-variables-input-value')
				.should('be.visible')
				.should('have.value', environments.input.editedValue);
		});
		it('Should show an error toast when deleting a variable', () => {
			cy.intercept(
				'GET',
				`${Cypress.env('apiUrl')}/collection/${collectionId}`,
				{
					fixture: './environments/one-collection-with-contract-id.json',
				},
			).as('getCollection');
			cy.intercept(
				'DELETE',
				`${Cypress.env('apiUrl')}/environment/${environments.id}`,
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
			cy.intercept(
				'GET',
				`${Cypress.env('apiUrl')}/collection/${collectionId}`,
				{
					fixture: './environments/one-collection-with-contract-id.json',
				},
			).as('getCollection');
			cy.intercept(
				'DELETE',
				`${Cypress.env('apiUrl')}/environment/${environments.id}`,
				{
					body: {
						id: environments.id,
					},
				},
			).as('deleteEnvironment');
			cy.intercept(
				'GET',
				`${Cypress.env('apiUrl')}/collection/*/environments`,
				{
					body: [],
				},
			).as('getEnvironments');

			cy.getBySel('collections-variables-btn-link').click();
			cy.getBySel('collection-variables-input-container').should('be.visible');
			cy.getBySel('collection-variables-btn-delete').click({ force: true });
			cy.wait('@deleteEnvironment');
			cy.wait('@getEnvironments');
			cy.getBySel('collection-variables-input-container').should('not.exist');
		});
	});
	describe('Environments in FunctionTabs', () => {
		beforeEach(() => {
			cy.getBySel('collection-folder-btn').click();
			cy.intercept(`${Cypress.env('apiUrl')}/collection/*/folders`, {
				fixture: 'folders/folder-with-contract-id.json',
			}).as('folders');
			cy.wait('@folders');
			cy.getBySel('collection-folder-container').click();
			cy.intercept('POST', `${Cypress.env('apiUrl')}/invocation`, {
				statusCode: 200,
				fixture: 'invocations/one-invocation.json',
			}).as('invocation');
			cy.intercept(`${Cypress.env('apiUrl')}/invocation/*`, {
				fixture: 'invocations/one-invocation-with-contract-id.json',
			}).as('getInvocation');
			cy.intercept(`${Cypress.env('apiUrl')}/method/*`, {
				fixture: './methods/increment-method.json',
			});
			cy.intercept(`${Cypress.env('apiUrl')}/collection/*/environments`, {
				fixture: './environments/five-environments.json',
			}).as('getEnvironments');
			cy.getBySel('invocation-item').first().click();
			cy.getBySel('tabs-container').should('be.visible');
		});
		it('Should show the environment dropdown', () => {
			cy.getBySel('dropdown-environments-container').should('not.exist');
			cy.getBySel('function-tab-parameter-input-value').type('{');
			cy.getBySel('dropdown-environments-container')
				.should('exist')
				.and('be.visible');

			cy.getBySel('function-tab-parameter-input-value').clear();
			cy.getBySel('function-tab-parameter-input-value').type('hola');
			cy.getBySel('dropdown-environments-container').should('not.exist');
			cy.getBySel('function-tab-parameter-input-value').type('{');
			cy.getBySel('dropdown-environments-container')
				.should('exist')
				.and('be.visible');
		});
		it('Should show the variables between {{ }}', () => {
			cy.getBySel('function-tab-parameter-input-value').type('{');
			cy.getBySel('dropdown-enviroment-li-container').eq(0).click();
			cy.getBySel('function-tab-parameter-input-value').should(
				'have.value',
				`{{${environments.list[0].name}}}`,
			);

			cy.getBySel('function-tab-parameter-input-value').clear();
			cy.getBySel('function-tab-parameter-input-value').type('hola {');
			cy.getBySel('dropdown-enviroment-li-container').eq(0).click();
			cy.getBySel('function-tab-parameter-input-value').should(
				'have.value',
				`hola {{${environments.list[0].name}}}`,
			);

			cy.getBySel('function-tab-parameter-input-value').clear();
			cy.getBySel('function-tab-parameter-input-value').type('url/{');
			cy.getBySel('dropdown-enviroment-li-container').eq(0).click();
			cy.getBySel('function-tab-parameter-input-value').type('/collection/{');
			cy.getBySel('dropdown-enviroment-li-container').eq(1).click();
			cy.getBySel('function-tab-parameter-input-value').should(
				'have.value',
				`url/{{${environments.list[0].name}}}/collection/{{${environments.list[1].name}}}`,
			);
		});
	});
});
