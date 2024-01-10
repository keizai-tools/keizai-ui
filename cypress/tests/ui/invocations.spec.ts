import {
	keypair,
	contractId,
	invocations,
	network,
} from './exceptions/constants';

describe('Invocations', () => {
	beforeEach(() => {
		cy.loginByCognitoApi();
		cy.intercept(`${Cypress.env('apiUrl')}/collection`, {
			fixture: 'collections/collection-with-one-invocation.json',
		}).as('collection');
		cy.wait('@collection');
	});
	describe('Invocations with data', () => {
		beforeEach(() => {
			cy.getBySel('collection-folder-btn').click();
			cy.intercept(`${Cypress.env('apiUrl')}/collection/*/folders`, {
				fixture: 'folders/folder-with-contract-id.json',
			}).as('folders');
			cy.wait('@folders');
			cy.getBySel('collection-folder-container').click();
			cy.intercept(`${Cypress.env('apiUrl')}/invocation/*`, {
				fixture: 'invocations/invocation-with-contract-id.json',
			}).as('invocationWithSelectedMethod');
			cy.intercept('PATCH', `${Cypress.env('apiUrl')}/invocation`, {
				fixture: 'invocations/one-invocation.json',
			}).as('invocation');
			cy.getBySel('invocation-item').first().click();
			cy.getBySel('tabs-container').should('be.visible');
			cy.intercept(`${Cypress.env('apiUrl')}/method/*`, {
				fixture: 'methods/method.json',
			}).as('method');
		});
		it('should select a method from invocation', () => {
			cy.getBySel('invocation-item').first().click();
			cy.getBySel('tabs-container').should('be.visible');
			cy.getBySel('tabs-function-select-container').first().click();
			cy.getBySel('tabs-function-select').first().click();
			cy.wait('@method');
		});
		it('Should show the content of the tab without events', () => {
			cy.getBySel('functions-tabs-events').click();
			cy.getBySel('events-tab-container').should('be.visible');
			cy.getBySel('events-tab-content-container').should('be.visible');
			cy.getBySel('events-tab-content-img')
				.should('be.visible')
				.and('have.attr', 'alt', invocations.tabs.events.imgAlt);
			cy.getBySel('events-tab-content-text')
				.should('be.visible')
				.find('h2')
				.each((title, index) =>
					cy
						.wrap(title)
						.should('contain.text', invocations.tabs.events.title[index]),
				);
		});
		describe('Change Network', () => {
			it('Should show a dropdown with different networks', () => {
				cy.getBySel('contract-input-container').should('be.visible');
				cy.getBySel('contract-input-selected-network').should(
					'have.text',
					network.futurenet,
				);
				cy.getBySel('contract-select-networks-container').should('not.exist');
				cy.getBySel('contract-input-network').should('be.visible').click();
				cy.getBySel('contract-select-networks-container')
					.should('exist')
					.and('be.visible');
				cy.getBySel('contract-select-network-futurenet')
					.should('be.visible')
					.and('have.text', network.futurenet);
				cy.getBySel('contract-select-network-testnet')
					.should('be.visible')
					.and('have.text', network.testnet);
			});
			it('Should change to testnet network', () => {
				cy.intercept('PATCH', `${Cypress.env('apiUrl')}/invocation/*/network`, {
					body: { network: 'TESTNET' },
				});
				cy.getBySel('contract-input-selected-network')
					.should('be.visible')
					.and('have.text', network.futurenet);
				cy.getBySel('contract-input-network').should('be.visible').click();
				cy.getBySel('contract-select-network-testnet').click();
				cy.getBySel('contract-input-selected-network')
					.should('be.visible')
					.and('have.text', network.testnet);
			});
			it('Should persist the network when changing routes', () => {
				cy.intercept('PATCH', `${Cypress.env('apiUrl')}/invocation/*/network`, {
					body: { network: 'TESTNET' },
				});
				cy.intercept(`${Cypress.env('apiUrl')}/invocation/*`, {
					fixture: 'invocations/one-invocation-with-keypair.json',
				}).as('invocationWithTestnetNetwork');
				cy.getBySel('contract-input-network').should('be.visible').click();
				cy.getBySel('contract-select-network-testnet').click();
				cy.getBySel('contract-input-selected-network')
					.should('be.visible')
					.and('have.text', network.testnet);
				cy.getBySel('collections-variables-btn-link').click();
				cy.getBySel('collection-variables-container').should('be.visible');
				cy.getBySel('invocation-item').first().click();
				cy.wait('@invocationWithTestnetNetwork');
				cy.getBySel('contract-input-selected-network').should(
					'have.text',
					network.testnet,
				);
			});
		}),
			describe('Events tracker tab', () => {
				beforeEach(() => {
					cy.wait('@method');
					cy.intercept(`${Cypress.env('apiUrl')}/invocation/*/run`, {
						fixture: 'invocations/run-invocation.json',
					}).as('runInvocation');
					cy.getBySel('contract-input-btn-load').click();
					cy.wait('@runInvocation');
					cy.getBySel('functions-tabs-events').click();
				});
				it('Should show the content of the tab with events', () => {
					cy.getBySel('events-tab-container').should('be.visible');
					cy.getBySel('events-tab-event-container').should('be.visible');
					cy.getBySel('events-tab-event-title').should('be.visible');
					cy.getBySel('events-tab-btn-copy').should('be.visible');
					cy.getBySel('events-tab-copy-tooltip').should('not.exist');
					cy.getBySel('events-tab-event-content').should('be.visible');
				});
				it('Should copy the content of an event', () => {
					cy.getBySel('events-tab-container').should('be.visible');
					cy.getBySel('events-tab-copy-tooltip').should('not.exist');
					cy.getBySel('events-tab-btn-copy')
						.eq(0)
						.should('be.visible')
						.realClick();
					cy.getBySel('events-tab-copy-tooltip')
						.should('exist')
						.and('be.visible')
						.contains('Copied!');
					cy.wait(1000);
					cy.getBySel('events-tab-copy-tooltip').should('not.exist');
				});
				it('Should persist events when change to other path', () => {
					cy.getBySel('events-tab-container').should('be.visible');
					cy.getBySel('collections-variables-btn-link').click();
					cy.getBySel('collection-variables-container').should('be.visible');
					cy.getBySel('invocation-item').first().click();
					cy.getBySel('functions-tabs-events').click();
					cy.getBySel('events-tab-container').should('be.visible');
				});
			});
	});

	describe('Invocation without data', () => {
		beforeEach(() => {
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
		describe('Invocation with futurenet network', () => {
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
			describe('Invocation with testnet network', () => {
				beforeEach(() => {
					cy.intercept('POST', `${Cypress.env('apiUrl')}/invocation`, {
						statusCode: 200,
						fixture: 'invocations/one-invocation.json',
					}).as('invocation');
					cy.intercept(`${Cypress.env('apiUrl')}/invocation/*`, {
						fixture: 'invocations/one-invocation-testnet.json',
					}).as('getInvocation');
				});
				it('Should update a invocation with generate new keypair', () => {
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
			});
		});
	});
});
