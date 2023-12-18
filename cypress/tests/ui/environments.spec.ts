import { collectionId, environment } from './exceptions/constants';

const environments = [
	{
		name: 'inc1',
		value: '1',
		id: '1585c667-114a-49c2-ba05-60847e7da0df',
	},
	{
		name: 'inc2',
		value: '2',
		id: '55cb9562-e6d7-4586-b099-571c058d3f69',
	},
	{
		name: 'inc3',
		value: '3',
		id: '7995f0d5-12ba-4ad5-97c5-f7d9fa9a5b0d',
	},
];

describe('Environments management', () => {
	beforeEach(() => {
		cy.loginByCognitoApi();
		cy.intercept('GET', `${Cypress.env('apiUrl')}/collection`, {
			fixture: './environments/collection-without-env.json',
		}).as('getCollections');
		cy.wait('@getCollections');
	});

	describe('Environment page with variables', () => {
		beforeEach(() => {
			cy.intercept(`${Cypress.env('apiUrl')}/collection/*/environments`, {
				fixture: './environments/three-length-environments.json',
			}).as('getEnvironments');
			cy.intercept(`${Cypress.env('apiUrl')}/collection/${collectionId}`, {
				fixture: './collections/collection-with-one-folder.json',
			}).as('getCollection');
			cy.getBySel('collection-folder-btn').click();
			cy.getBySel('collections-variables-btn-link').click();
			cy.wait('@getEnvironments');
		});
		it('Should delete all environments', () => {
			cy.intercept(
				'DELETE',
				`${Cypress.env('apiUrl')}/environment/${environments[0].id}`,
				{
					body: {
						id: environments[0].id,
					},
				},
			).as('deleteThirdEnvironment');
			cy.intercept(
				'DELETE',
				`${Cypress.env('apiUrl')}/environment/${environments[1].id}`,
				{
					body: {
						id: environments[1].id,
					},
				},
			).as('deleteSecondEnvironment');
			cy.intercept(
				'DELETE',
				`${Cypress.env('apiUrl')}/environment/${environments[2].id}`,
				{
					body: {
						id: environments[2].id,
					},
				},
			).as('deleteFirstEnvironment');

			cy.getBySel('collection-variables-container').should('be.visible');
			cy.getBySel('collection-variables-input-container')
				.should('have.length', environments.length)
				.each((li, index) => {
					cy.wrap(li)
						.find('[data-test="collection-variables-input-name"]')
						.should('have.value', environments[index].name);
					cy.wrap(li)
						.find('[data-test="collection-variables-input-value"]')
						.should('have.value', environments[index].value);
				});
			cy.getBySel('collection-variables-btn-delete')
				.eq(environments.length - 1)
				.click();
			cy.wait('@deleteFirstEnvironment');

			cy.getBySel('collection-variables-input-container')
				.should('have.length', environments.length - 1)
				.each((list, index) => {
					cy.wrap(list)
						.find('[data-test="collection-variables-input-name"]')
						.should('have.value', environments[index].name);
					cy.wrap(list)
						.find('[data-test="collection-variables-input-value"]')
						.should('have.value', environments[index].value);
				});
			cy.getBySel('collection-variables-btn-delete')
				.eq(environments.length - 2)
				.click();
			cy.wait('@deleteSecondEnvironment');

			cy.getBySel('collection-variables-input-container').should(
				'have.length',
				environments.length - 2,
			);
			cy.getBySel('collection-variables-input-name').should(
				'have.value',
				environments[0].name,
			);
			cy.getBySel('collection-variables-input-value').should(
				'have.value',
				environments[0].value,
			);
			cy.getBySel('collection-variables-btn-delete').click();
			cy.wait('@deleteThirdEnvironment');

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
		it('Should show different environment values in the environment dropdown', () => {
			cy.getBySel('dropdown-environments-container').should('not.exist');
			cy.getBySel('function-tab-parameter-input-value').type('{');
			cy.getBySel('dropdown-environments-container')
				.should('exist')
				.and('be.visible');
			cy.getBySel('dropdown-enviroment-li-container').each((li, index) => {
				cy.wrap(li).realHover();
				cy.getBySel('dropdown-hover-enviroment-value').should(
					'have.text',
					environments.list[index].value,
				);
			});
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