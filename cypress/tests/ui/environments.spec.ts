import { environments, invocations } from './exceptions/constants';

describe('Environments management', () => {
	beforeEach(() => {
		cy.loginByCognitoApi();
	});
	describe('By User - [/user]', () => {
		beforeEach(() => {
			cy.visit('/user');
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
				cy.intercept('GET', `${Cypress.env('apiUrl')}/collection/*/folders`, {
					fixture: './environments/folder-with-contract-id.json',
				});
				cy.getBySel('collection-folder-btn').click();
			});
			it('Should show collection variables link', () => {
				cy.getBySel('collections-variables-btn-link').should(
					'have.text',
					environments.linkName,
				);
			});
			it('Should navigate to the collection variables without variables', () => {
				cy.intercept('GET', `${Cypress.env('apiUrl')}/collection/*`, {
					fixture: './environments/one-collection-with-contract-id.json',
				}).as('getCollection');

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
				cy.getBySel('collection-variables-btn-save').should('not.exist');
				cy.getBySel('collection-variables-empty-state')
					.should('be.visible')
					.and('have.text', environments.emptyStateText);
			});
		});
		describe('Environment page with variables', () => {
			beforeEach(() => {
				cy.intercept(`${Cypress.env('apiUrl')}/collection/*/environments`, {
					fixture: './environments/three-length-environments.json',
				}).as('getEnvironments');
				cy.intercept(`${Cypress.env('apiUrl')}/collection/*/folders`, {
					fixture: './environments/folder-with-contract-id.json',
				}).as('getCollection');
				cy.getBySel('collection-folder-btn').click();
				cy.getBySel('collections-variables-btn-link').click();
				cy.wait('@getEnvironments');
			});
			it('Should navigate to the collection variables with a variable', () => {
				cy.intercept('GET', `${Cypress.env('apiUrl')}/collection/*`, {
					fixture: './environments/one-collection-with-contract-id.json',
				}).as('getCollection');

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
				cy.getBySel('collection-variables-input-container').should(
					'be.visible',
				);
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
			it('Should edit a variable successfully', () => {
				cy.intercept('GET', `${Cypress.env('apiUrl')}/collection/*`, {
					fixture: './environments/one-collection-with-contract-id.json',
				}).as('getCollection');
				cy.intercept('PATCH', `${Cypress.env('apiUrl')}/environment`, {
					fixture: './environments/edited-environment.json',
				}).as('editEnvironments');
				cy.intercept(
					'GET',
					`${Cypress.env('apiUrl')}/collection/*/environments`,
					{
						fixture: './environments/edited-environment.json',
					},
				).as('getEditedEnvironments');
				cy.getBySel('collections-variables-btn-link').click();

				cy.getBySel('collection-variables-input-name').clear();
				cy.getBySel('collection-variables-input-value').clear();

				cy.getBySel('collection-variables-input-name')
					.eq(0)
					.should('be.visible')
					.type(environments.input.editedKey);
				cy.getBySel('collection-variables-input-value')
					.eq(0)
					.should('be.visible')
					.type(environments.input.editedValue);
				cy.wait('@editEnvironments');
				cy.reload();

				cy.wait('@getEditedEnvironments');
				cy.getBySel('collection-variables-input-name')
					.should('be.visible')
					.should('have.value', environments.input.editedKey);
				cy.getBySel('collection-variables-input-value')
					.should('be.visible')
					.should('have.value', environments.input.editedValue);
			});
			it('Should show an error toast when editing a variable', () => {
				cy.intercept('PATCH', `${Cypress.env('apiUrl')}/environment`, {
					statusCode: 400,
				}).as('editEnvironments');

				cy.getBySel('collections-variables-btn-link').click();
				cy.getBySel('collection-variables-input-name').eq(0).clear();
				cy.getBySel('collection-variables-input-name')
					.eq(0)
					.should('be.visible')
					.type(environments.input.editedKey);
				cy.wait('@editEnvironments');
				cy.getBySel('toast-container').should('exist').and('be.visible');
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
			it('Should show an error toast when deleting a variable', () => {
				cy.intercept('GET', `${Cypress.env('apiUrl')}/collection/*`, {
					fixture: './environments/one-collection-with-contract-id.json',
				}).as('getCollection');
				cy.intercept('DELETE', `${Cypress.env('apiUrl')}/environment/*`, {
					statusCode: 400,
				});
				cy.getBySel('collections-variables-btn-link').click();
				cy.getBySel('collection-variables-input-container').should(
					'be.visible',
				);
				cy.getBySel('collection-variables-btn-delete').eq(0).click();
				cy.getBySel('toast-container').should('exist').and('be.visible');
			});
			it('Should delete all environments', () => {
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
				cy.getBySel('invocation-item').first().click();
				cy.getBySel('tabs-container').should('be.visible');
			});
			describe('Without environments', () => {
				beforeEach(() => {
					cy.intercept(`${Cypress.env('apiUrl')}/collection/*/environments`, {
						body: [],
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
					cy.getBySel('dropdown-enviroments-empty-state')
						.should('be.visible')
						.and('have.text', environments.emptyStateText);
				});
				it('Should show dropdown in edit contract address', () => {
					cy.getBySel('btn-edit-contract-address').realHover().click();
					cy.getBySel('dialog-edit-contract-address-container')
						.should('exist')
						.and('be.visible');
					cy.getBySel('dropdown-environments-container').should('not.exist');
					cy.getBySel('dialog-edit-contract-address-input').type('{');
					cy.getBySel('dropdown-environments-container')
						.should('exist')
						.and('be.visible');
					cy.getBySel('dropdown-enviroments-empty-state')
						.should('be.visible')
						.and('have.text', environments.emptyStateText);
				});
			});
			describe('With environments', () => {
				beforeEach(() => {
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
					cy.getBySel('function-tab-parameter-input-value')
						.find('textarea')
						.should('have.value', `{{${environments.list[0].name}}}`);
					cy.getBySel('function-tab-parameter-input-value')
						.find('textarea')
						.clear();
					cy.getBySel('function-tab-parameter-input-value')
						.find('textarea')
						.type('hola {');
					cy.getBySel('dropdown-enviroment-li-container').eq(0).click();
					cy.getBySel('function-tab-parameter-input-value')
						.find('textarea')
						.should('have.value', `hola {{${environments.list[0].name}}}`);
					cy.getBySel('function-tab-parameter-input-value')
						.find('textarea')
						.clear();
					cy.getBySel('function-tab-parameter-input-value')
						.find('textarea')
						.type('url/{');
					cy.getBySel('dropdown-enviroment-li-container').eq(0).click();
					cy.getBySel('function-tab-parameter-input-value')
						.find('textarea')
						.type('/collection/{');
					cy.getBySel('dropdown-enviroment-li-container').eq(1).click();
					cy.getBySel('function-tab-parameter-input-value')
						.find('textarea')
						.should(
							'have.value',
							`url/{{${environments.list[0].name}}}/collection/{{${environments.list[1].name}}}`,
						);
				});
				it('Should edit contract address with an environment', () => {
					cy.intercept('PATCH', `${Cypress.env('apiUrl')}/invocation`, {
						fixture: 'invocations/one-invocation.json',
					}).as('invocation');
					cy.intercept(`${Cypress.env('apiUrl')}/invocation/*`, {
						fixture: 'invocations/invocation-with-env-contract.json',
					}).as('invocation');
					cy.getBySel('btn-edit-contract-address').realHover().click();
					cy.getBySel('dialog-edit-contract-address-container')
						.should('exist')
						.and('be.visible');
					cy.getBySel('dropdown-environments-container').should('not.exist');
					cy.getBySel('dialog-edit-contract-address-input').type('{');
					cy.getBySel('dropdown-environments-container')
						.should('exist')
						.and('be.visible');
					cy.getBySel('dropdown-enviroment-li-container').eq(0).click();
					cy.getBySel('dialog-edit-contract-address-btn-save').click();
					cy.getBySel('contract-input-address').should(
						'have.text',
						invocations.default.contract.environmentValue,
					);
				});
			});
		});
	});
});
