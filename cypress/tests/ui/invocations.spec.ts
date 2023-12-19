import { keypair, contractId } from './exceptions/constants';

describe('Invocations', () => {
	beforeEach(() => {
		cy.loginByCognitoApi();
	});
	describe('Invocations with data', () => {
		beforeEach(() => {
			cy.intercept(`${Cypress.env('apiUrl')}/collection`, {
				fixture: 'collections/collection-with-one-invocation.json',
			}).as('collection');
			cy.wait('@collection');
			cy.getBySel('collection-folder-btn').click();
			cy.intercept(`${Cypress.env('apiUrl')}/collection/*/folders`, {
				fixture: 'folders/folder-with-contract-id.json',
			}).as('folders');
			cy.wait('@folders');
			cy.getBySel('collection-folder-container').click();
			cy.intercept(`${Cypress.env('apiUrl')}/invocation/*`, {
				fixture: 'invocations/invocation-with-contract-id.json',
			});
			cy.intercept('PATCH', `${Cypress.env('apiUrl')}/invocation`, {
				fixture: 'invocations/one-invocation.json',
			}).as('invocation');
		});
		it('should get invocation data', () => {
			cy.getBySel('invocation-item').first().click();
			cy.getBySel('tabs-container').should('be.visible');
		});
		it('should select a method from invocation', () => {
			cy.intercept(`${Cypress.env('apiUrl')}/method/*`, {
				fixture: 'methods/method.json',
			}).as('method');
			cy.getBySel('invocation-item').first().click();
			cy.getBySel('tabs-container').should('be.visible');
			cy.getBySel('tabs-function-select-container').first().click();
			cy.getBySel('tabs-function-select').first().click();
			cy.wait('@method');
		});
	});

	describe('Invocation without data', () => {
		beforeEach(() => {
			cy.intercept(`${Cypress.env('apiUrl')}/collection`, {
				fixture: 'collections/collection-with-one-folder.json',
			}).as('collection');
			cy.wait('@collection');
			cy.getBySel('collection-folder-btn').click();
			cy.intercept(`${Cypress.env('apiUrl')}/collection/*/folders`, {
				fixture: 'folders/one-folder-with-out-invocation.json',
			}).as('folders');
			cy.wait('@folders');
			cy.intercept('PATCH', `${Cypress.env('apiUrl')}/invocation`, {
				fixture: 'invocations/one-invocation.json',
			}).as('invocation');
			cy.getBySel('collection-folder-container').click();
		});
		describe('Create a invocation and their keys', () => {
			beforeEach(() => {
				cy.intercept('POST', `${Cypress.env('apiUrl')}/invocation`, {
					statusCode: 200,
					fixture: 'invocations/one-invocation.json',
				}).as('invocation');
				cy.intercept(`${Cypress.env('apiUrl')}/invocation/*`, {
					fixture: 'invocations/one-invocation.json',
				}).as('getInvocation');
			});
			it('should create a invocation', () => {
				cy.getBySel('new-invocation-btn-container').first().click();
				cy.getBySel('new-entity-dialog-btn-submit').click();
				cy.wait('@invocation');
				cy.wait('@getInvocation');
			});

			it('should update a invocation with a keypair', () => {
				cy.intercept('PATCH', `${Cypress.env('apiUrl')}/invocation`, {
					statusCode: 200,
					fixture: 'invocations/one-invocation-with-keypair.json',
				}).as('keypair');
				cy.getBySel('new-invocation-btn-container').first().click();
				cy.getBySel('new-entity-dialog-btn-submit').click();
				cy.wait('@invocation');
				cy.wait('@getInvocation');
				cy.getBySel('functions-tabs-authorization').first().click();
				cy.getBySel('auth-stellar-create-account-btn').click();
				cy.wait('@keypair');
			});

			it('Should show a modal to connect with private key', () => {
				cy.intercept('PATCH', `${Cypress.env('apiUrl')}/invocation`, {
					fixture: './invocations/one-invocation-with-keypair.json',
				}).as('importSecretKey');

				cy.getBySel('new-invocation-btn-container').first().click();
				cy.getBySel('new-entity-dialog-btn-submit').click();
				cy.wait('@invocation');
				cy.wait('@getInvocation');

				const importAccount = {
					title: 'Connect with a secret key',
					description: 'Please enter your secret key to authenticate',
					button: 'Connect',
					error: {
						required: 'Secret key is required',
						invalidSecretKey: 'Please enter a valid Private key',
					},
				};
				cy.getBySel('functions-tabs-authorization').click();
				cy.getBySel('auth-stellar-import-account-btn').click();
				cy.getBySel('import-account-modal-container').should('be.visible');
				cy.getBySel('import-account-modal-title')
					.should('be.visible')
					.and('have.text', importAccount.title);
				cy.getBySel('import-account-modal-description')
					.should('be.visible')
					.and('have.text', importAccount.description);
				cy.getBySel('import-account-modal-form-container').should('be.visible');
				cy.getBySel('import-account-modal-error').should('not.exist');
				cy.getBySel('import-account-modal-btn-submit').click();
				cy.getBySel('import-account-modal-error')
					.should('be.visible')
					.and('have.text', importAccount.error.required);
				cy.getBySel('import-account-modal-input').type(keypair.publicKey.key);
				cy.getBySel('import-account-modal-btn-submit').click();
				cy.getBySel('import-account-modal-error')
					.should('be.visible')
					.and('have.text', importAccount.error.invalidSecretKey);
				cy.getBySel('import-account-modal-input').clear();
				cy.getBySel('import-account-modal-input')
					.should('be.visible')
					.type(keypair.secretKey.key);
				cy.getBySel('import-account-modal-btn-submit')
					.should('be.visible')
					.and('have.text', importAccount.button)
					.click();

				cy.wait('@importSecretKey');
				cy.getBySel('auth-tab-secret-key')
					.should('be.visible')
					.find('input')
					.invoke('val')
					.and('match', keypair.secretKey.regex);
				cy.getBySel('auth-tab-public-key')
					.should('be.visible')
					.find('input')
					.invoke('val')
					.and('match', keypair.publicKey.regex);
			});

			it('should update contract id from invocation', () => {
				cy.intercept('PATCH', `${Cypress.env('apiUrl')}/invocation`, {
					statusCode: 200,
					fixture: 'invocations/invocation-with-contract-id.json',
				}).as('invocationUpdated');

				cy.getBySel('new-invocation-btn-container').first().click();
				cy.getBySel('new-entity-dialog-btn-submit').click();
				cy.wait('@invocation');
				cy.wait('@getInvocation');
				cy.getBySel('input-contract-name').type(contractId);
				cy.intercept('GET', `${Cypress.env('apiUrl')}/invocation/*`, {
					fixture: 'invocations/invocation-with-contract-id.json',
				}).as('getInvocationWithMethods');
				cy.getBySel('contract-input-btn-load').click();
				cy.wait('@invocationUpdated');
				cy.wait('@getInvocationWithMethods');
			});
		});
	});
});
