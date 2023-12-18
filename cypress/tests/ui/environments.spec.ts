import { collectionId, environments } from './exceptions/constants';

describe('Environments management', () => {
	beforeEach(() => {
		cy.loginByCognitoApi();
		cy.intercept(`${Cypress.env('apiUrl')}/collection`, {
			fixture: './collections/collection-with-one-folder.json',
		}).as('getCollections');
		cy.wait('@getCollections');
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
		cy.intercept('POST', `${Cypress.env('apiUrl')}/collection/*/environments`, {
			statusCode: 400,
		}).as('postEnvironments');
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
		cy.intercept('POST', `${Cypress.env('apiUrl')}/collection/*/environments`, {
			fixture: './environments/three-length-environments.json',
		}).as('postEnvironments');
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
	it('Should delete all environments', () => {
		cy.intercept(
			'DELETE',
			`${Cypress.env('apiUrl')}/environment/${environments.list[0].id}`,
			{
				body: {
					id: environments.list[0].id,
				},
			},
		).as('deleteThirdEnvironment');
		cy.intercept(
			'DELETE',
			`${Cypress.env('apiUrl')}/environment/${environments.list[1].id}`,
			{
				body: {
					id: environments.list[1].id,
				},
			},
		).as('deleteSecondEnvironment');
		cy.intercept(
			'DELETE',
			`${Cypress.env('apiUrl')}/environment/${environments.list[2].id}`,
			{
				body: {
					id: environments.list[2].id,
				},
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
		cy.getBySel('collection-variables-btn-delete')
			.eq(environments.list.length - 1)
			.click();
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
		cy.getBySel('collection-variables-btn-delete')
			.eq(environments.list.length - 2)
			.click();
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
		cy.getBySel('collection-variables-btn-delete').click();
		cy.wait('@deleteThirdEnvironment');

		cy.getBySel('collection-variables-input-container').should('not.exist');
	});
});
