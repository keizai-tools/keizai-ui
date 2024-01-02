import { collectionId, environments } from './exceptions/constants';

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
		it('Should show an error message when trying to create the variables with empty fields', () => {
			cy.getBySel('collection-variables-container').should('be.visible');
			cy.getBySel('collection-variables-btn-add').click();
			cy.getBySel('collection-variables-btn-save').click();

			cy.getBySel('collection-variables-input-name-error')
				.last()
				.should('be.visible')
				.and('have.text', environments.input.error.name.empty);
			cy.getBySel('collection-variables-input-value-error')
				.last()
				.should('be.visible')
				.and('have.text', environments.input.error.value.empty);
		});
		it('Should show an error message when trying to create variables with repeated names', () => {
			cy.getBySel('collection-variables-container').should('be.visible');
			cy.getBySel('collection-variables-btn-add').click();
			cy.getBySel('collection-variables-input-name')
				.last()
				.type(environments.list[0].name);
			cy.getBySel('collection-variables-btn-save').click();

			cy.getBySel('collection-variables-input-name-error')
				.last()
				.should('be.visible')
				.and('have.text', environments.input.error.name.exist);
		});
		it('Should show an error message when the variables cannot be created', () => {
			cy.intercept(
				'POST',
				`${Cypress.env('apiUrl')}/collection/*/environments`,
				{
					statusCode: 400,
				},
			).as('postEnvironments');
			cy.getBySel('collection-variables-container').should('be.visible');
			cy.getBySel('collection-variables-btn-add').click();
			cy.getBySel('collection-variables-btn-add').click();
			cy.getBySel('collection-variables-btn-add').click();

			cy.getBySel('collection-variables-input-name').eq(3).type('inc4');
			cy.getBySel('collection-variables-input-value').eq(3).type('4');

			cy.getBySel('collection-variables-input-name').eq(4).type('inc5');
			cy.getBySel('collection-variables-input-value').eq(4).type('5');

			cy.getBySel('collection-variables-input-name').eq(5).type('inc6');
			cy.getBySel('collection-variables-input-value').eq(5).type('6');

			cy.getBySel('collection-variables-btn-save').click();
			cy.wait('@postEnvironments');
			cy.getBySel('toast-container').should('exist').and('be.visible');
		});
		it('Should create 3 new variables correctly', () => {
			cy.intercept(
				'POST',
				`${Cypress.env('apiUrl')}/collection/*/environments`,
				{
					fixture: './environments/three-length-environments.json',
				},
			).as('postEnvironments');
			cy.getBySel('collection-variables-container').should('be.visible');
			cy.getBySel('collection-variables-btn-add').click();
			cy.getBySel('collection-variables-btn-add').click();
			cy.getBySel('collection-variables-btn-add').click();

			cy.getBySel('collection-variables-input-name').eq(3).type('inc4');
			cy.getBySel('collection-variables-input-value').eq(3).type('4');

			cy.getBySel('collection-variables-input-name').eq(4).type('inc5');
			cy.getBySel('collection-variables-input-value').eq(4).type('5');

			cy.getBySel('collection-variables-input-name').eq(5).type('inc6');
			cy.getBySel('collection-variables-input-value').eq(5).type('6');

			cy.getBySel('collection-variables-btn-save').click();
			cy.wait('@postEnvironments');
			cy.getBySel('toast-container').should('exist').and('be.visible');
		});
		it.only('Should delete all environments', () => {
			cy.intercept(
				'DELETE',
				`${Cypress.env('apiUrl')}/environment/${environments.list[0].id}`,
				{
					body: true,
				},
			).as('deleteThirdEnvironment');
			cy.intercept(
				'DELETE',
				`${Cypress.env('apiUrl')}/environment/${environments.list[1].id}`,
				{
					body: true,
				},
			).as('deleteSecondEnvironment');
			cy.intercept(
				'DELETE',
				`${Cypress.env('apiUrl')}/environment/${environments.list[2].id}`,
				{
					body: true,
				},
			).as('deleteFirstEnvironment');

			cy.getBySel('collection-variables-container').should('be.visible');
			cy.getBySel('collection-variables-input-container')
				.should('have.length', environments.list.length)
				.each((li, index) => {
					cy.wrap(li)
						.find('[data-test="collection-variables-input-name"]')
						.should('have.value', environments.list[index].name);
					cy.wrap(li)
						.find('[data-test="collection-variables-input-value"]')
						.should('have.value', environments.list[index].value);
				});
			cy.intercept(
				'GET',
				`${Cypress.env('apiUrl')}/collection/*/environments`,
				{
					body: [environments.list[0], environments.list[1]],
				},
			).as('get2Environments');
			cy.getBySel('collection-variables-btn-delete')
				.eq(environments.list.length - 1)
				.click();

			cy.wait('@get2Environments');
			cy.wait('@deleteFirstEnvironment');

			cy.getBySel('collection-variables-input-container')
				.should('have.length', environments.list.length - 1)
				.each((list, index) => {
					cy.wrap(list)
						.find('[data-test="collection-variables-input-name"]')
						.should('have.value', environments.list[index].name);
					cy.wrap(list)
						.find('[data-test="collection-variables-input-value"]')
						.should('have.value', environments.list[index].value);
				});
			cy.intercept(
				'GET',
				`${Cypress.env('apiUrl')}/collection/*/environments`,
				{
					body: [environments.list[0]],
				},
			).as('get1Environment');
			cy.getBySel('collection-variables-btn-delete')
				.eq(environments.list.length - 2)
				.click();

			cy.wait('@get1Environment');
			cy.wait('@deleteSecondEnvironment');

			cy.getBySel('collection-variables-input-container').should(
				'have.length',
				environments.list.length - 2,
			);
			cy.getBySel('collection-variables-input-name').should(
				'have.value',
				environments.list[0].name,
			);
			cy.getBySel('collection-variables-input-value').should(
				'have.value',
				environments.list[0].value,
			);
			cy.intercept(
				'GET',
				`${Cypress.env('apiUrl')}/collection/*/environments`,
				{
					body: [],
				},
			).as('emptyEnvironments');
			cy.getBySel('collection-variables-btn-delete').click();

			cy.wait('@emptyEnvironments');
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
			cy.intercept('PATCH', `${Cypress.env('apiUrl')}/invocation`, {
				fixture: 'invocations/one-invocation.json',
			}).as('invocation');
			cy.intercept(`${Cypress.env('apiUrl')}/invocation/*`, {
				fixture: 'invocations/one-invocation-with-contract-id.json',
			}).as('getInvocation');
			cy.intercept(`${Cypress.env('apiUrl')}/method/*`, {
				fixture: './methods/increment-method.json',
			});
			cy.intercept(`${Cypress.env('apiUrl')}/collection/*/environments`, {
				fixture: './environments/three-length-environments.json',
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
