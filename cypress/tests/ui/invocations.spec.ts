import {
	keypair,
	contractId,
	invocations,
	NETWORK,
	terminal,
	invocationId,
	events,
	changeNetwork,
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
			cy.window().then((win) => {
				win.sessionStorage.setItem(
					`events-${invocationId}`,
					JSON.stringify(events),
				);
			});
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
		it('Should show an error message when the contract is down', () => {
			cy.wait('@method');
			cy.intercept(`${Cypress.env('apiUrl')}/invocation/*/run`, {
				fixture: 'invocations/failed-run-invocation.json',
			}).as('runInvocation');
			cy.getBySel('contract-input-btn-load').click();
			cy.wait('@runInvocation');
			cy.getBySel('terminal-entry-container').should('be.visible');
			cy.getBySel('terminal-entry-title')
				.find('div')
				.should('be.visible')
				.and('have.text', terminal.error[0].title);
			cy.getBySel('terminal-entry-message')
				.should('be.visible')
				.and('have.text', terminal.error[0].message);
		});
		it('Should delete an invocation successfully', () => {
			cy.intercept(`${Cypress.env('apiUrl')}/collection/*/folders`, {
				fixture: 'folders/one-folder-with-out-invocation.json',
			}).as('folderWithOutInvocation');
			cy.intercept('DELETE', `${Cypress.env('apiUrl')}/invocation/*`, {
				body: [],
			}).as('deleteInvocation');

			cy.getBySel('invocation-item').eq(0).realHover();
			cy.getBySel('collection-options-btn').eq(1).click();
			cy.getBySel('collection-options-delete').click();

			cy.getBySel('delete-entity-dialog-container')
				.should('exist')
				.and('be.visible');
			cy.getBySel('delete-entity-dialog-title')
				.should('be.visible')
				.and('have.text', invocations.dialog.delete.title);
			cy.getBySel('delete-entity-dialog-description')
				.should('be.visible')
				.and('have.text', invocations.dialog.delete.description);
			cy.getBySel('delete-entity-dialog-btn-cancel')
				.should('be.visible')
				.and('have.text', invocations.dialog.delete.btnCancelText);
			cy.getBySel('delete-entity-dialog-btn-continue')
				.should('be.visible')
				.and('have.text', invocations.dialog.delete.btnContinueText)
				.click();
			cy.wait('@deleteInvocation');
			cy.wait('@folderWithOutInvocation');

			cy.getBySel('collection-empty-invocation-container')
				.should('exist')
				.and('be.visible');
		});
		describe('Change Network', () => {
			it('Should show a dropdown with different networks', () => {
				cy.getBySel('contract-input-container').should('be.visible');
				cy.getBySel('contract-input-selected-network').should(
					'have.text',
					NETWORK.FUTURENET,
				);
				cy.getBySel('contract-select-networks-container').should('not.exist');
				cy.getBySel('contract-input-network').should('be.visible').click();
				cy.getBySel('contract-select-networks-container')
					.should('exist')
					.and('be.visible');
				cy.getBySel('contract-select-network-futurenet')
					.should('be.visible')
					.and('have.text', NETWORK.FUTURENET);
				cy.getBySel('contract-select-network-testnet')
					.should('be.visible')
					.and('have.text', NETWORK.TESTNET);
			});
			it('Should show a alert dialog', () => {
				cy.getBySel('contract-input-selected-network')
					.should('be.visible')
					.and('have.text', NETWORK.FUTURENET);
				cy.getBySel('contract-input-network').should('be.visible').click();
				cy.getBySel('change-network-dialog-container').should('not.exist');
				cy.getBySel('contract-select-network-testnet').click();
				cy.getBySel('change-network-dialog-container')
					.should('exist')
					.and('be.visible');
				cy.getBySel('change-network-dialog-header-title')
					.should('be.visible')
					.and('have.text', changeNetwork.alertDialog.header);
				cy.getBySel('change-network-dialog-title')
					.should('be.visible')
					.and('have.text', changeNetwork.alertDialog.title);
				cy.getBySel('change-network-dialog-description')
					.should('be.visible')
					.and('have.text', changeNetwork.alertDialog.description);
				cy.getBySel('change-network-dialog-btn-cancel')
					.should('be.visible')
					.and('have.text', changeNetwork.alertDialog.btnCancel);
				cy.getBySel('change-network-dialog-btn-continue')
					.should('be.visible')
					.and('have.text', changeNetwork.alertDialog.btnConfirm);
			});
			it('Should keep the network when you click cancel in the alert dialog', () => {
				cy.getBySel('contract-input-selected-network')
					.should('be.visible')
					.and('have.text', NETWORK.FUTURENET);
				cy.getBySel('contract-input-network').should('be.visible').click();
				cy.getBySel('contract-select-network-testnet').click();
				cy.getBySel('change-network-dialog-container')
					.should('exist')
					.and('be.visible');
				cy.getBySel('change-network-dialog-btn-cancel').click();
				cy.getBySel('change-network-dialog-container').should('not.exist');
				cy.getBySel('contract-input-selected-network')
					.should('be.visible')
					.and('have.text', NETWORK.FUTURENET);
				cy.getBySel('tabs-function-container')
					.should('exist')
					.and('be.visible');
			});
			it('Should change to testnet network', () => {
				cy.intercept('PATCH', `${Cypress.env('apiUrl')}/invocation`, {
					body: { network: 'TESTNET' },
				}).as('changeNetwork');
				cy.intercept(`${Cypress.env('apiUrl')}/invocation/*`, {
					fixture: 'invocations/one-invocation-testnet.json',
				}).as('getInvocationWithTestnet');
				cy.getBySel('contract-input-selected-network')
					.should('be.visible')
					.and('have.text', NETWORK.FUTURENET);
				cy.getBySel('contract-input-network').should('be.visible').click();
				cy.getBySel('contract-select-network-testnet').click();
				cy.getBySel('change-network-dialog-container')
					.should('exist')
					.and('be.visible');
				cy.getBySel('change-network-dialog-btn-continue').click();
				cy.wait('@changeNetwork');
				cy.wait('@getInvocationWithTestnet');
				cy.getBySel('change-network-dialog-container').should('not.exist');
				cy.getBySel('contract-input-selected-network')
					.should('be.visible')
					.and('have.text', NETWORK.TESTNET);
				cy.getBySel('tabs-content-container').should('exist').and('be.visible');
			});
			it('Should persist the network when changing routes', () => {
				cy.intercept('PATCH', `${Cypress.env('apiUrl')}/invocation`, {
					body: { network: 'TESTNET' },
				}).as('changeNetwork');
				cy.intercept(`${Cypress.env('apiUrl')}/invocation/*`, {
					fixture: 'invocations/one-invocation-testnet.json',
				}).as('getInvocationWithTestnet');
				cy.getBySel('contract-input-network').should('be.visible').click();
				cy.getBySel('contract-select-network-testnet').click();
				cy.getBySel('change-network-dialog-btn-continue').click();
				cy.wait('@changeNetwork');
				cy.wait('@getInvocationWithTestnet');
				cy.getBySel('contract-input-selected-network')
					.should('be.visible')
					.and('have.text', NETWORK.TESTNET);
				cy.getBySel('collections-variables-btn-link').click();
				cy.getBySel('collection-variables-container').should('be.visible');
				cy.getBySel('invocation-item').first().click();
				cy.wait('@getInvocationWithTestnet');
				cy.getBySel('contract-input-selected-network').should(
					'have.text',
					NETWORK.TESTNET,
				);
			});
		}),
			describe.skip('Events tracker tab', () => {
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
					cy.getBySel('invocation-item').click();
					cy.getBySel('functions-tabs-events').click();
					cy.getBySel('events-tab-container').should('be.visible');
					cy.getBySel('functions-tabs-events').click();
				});
				it('Should create a new invocation and contain empty events', () => {
					cy.intercept('POST', `${Cypress.env('apiUrl')}/invocation`, {
						fixture: 'invocations/new-invocation.json',
					}).as('createInvocation');
					cy.intercept(`${Cypress.env('apiUrl')}/invocation/*`, {
						fixture: 'invocations/invocation-with-contract-id.json',
					}).as('newInvocation');
					cy.intercept(`${Cypress.env('apiUrl')}/collection/*/folders`, {
						fixture: 'folders/folder-with-two-invocations.json',
					}).as('folders');

					cy.getBySel('events-tab-container').should('be.visible');
					cy.getBySel('events-tab-event-container').should('be.visible');
					cy.getBySel('new-invocation-btn-container').first().click();
					cy.getBySel('new-entity-dialog-btn-submit').click();
					cy.wait('@createInvocation');
					cy.wait('@folders');
					cy.wait('@newInvocation');
					cy.getBySel('collection-folder-container').click();
					cy.getBySel('invocation-item').click();
					cy.getBySel('functions-tabs-events').click();
					cy.getBySel('events-tab-empty-state-container').should('be.visible');
				});
			});
	});

	describe('Invocation without data', () => {
		beforeEach(() => {
			cy.intercept(`${Cypress.env('apiUrl')}/collection/*/environments`, {
				fixture: 'environments/collection-with-environments.json',
			});
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
			it('Should show the content of the tab without events', () => {
				cy.getBySel('new-invocation-btn-container').first().click();
				cy.getBySel('new-entity-dialog-btn-submit').click();
				cy.wait('@invocation');
				cy.wait('@getInvocation');

				cy.getBySel('functions-tabs-events').click();
				cy.getBySel('events-tab-container').should('be.visible');
				cy.getBySel('events-tab-empty-state-container').should('be.visible');
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
			it('Should run a contract with an environment contract id', () => {
				cy.intercept('PATCH', `${Cypress.env('apiUrl')}/invocation`, {
					statusCode: 200,
					fixture: 'invocations/invocation-with-contract-id.json',
				}).as('runInvocation');
				cy.getBySel('new-invocation-btn-container').first().click();
				cy.getBySel('new-entity-dialog-btn-submit').click();
				cy.wait('@invocation');
				cy.wait('@getInvocation');

				cy.intercept(`${Cypress.env('apiUrl')}/invocation/*`, {
					fixture: 'invocations/one-invocation-with-contract-id.json',
				}).as('getInvocationWithContractId');
				cy.get('.input-contract-name').should('include.text', '');
				cy.getBySel('environment-input-placeholder').should(
					'have.text',
					invocations.default.contract.placeholder,
				);
				cy.get('.input-contract-name')
					.find('textarea')
					.click({ force: true })
					.type('{', { force: true });
				cy.getBySel('dropdown-environments-container')
					.should('exist')
					.and('be.visible');
				cy.getBySel('dropdown-environments-ul-container').eq(0).click();
				cy.getBySel('dropdown-environments-container').should('not.exist');
				cy.contains(
					'.monaco-editor',
					invocations.default.contract.environmentValue,
				);
				cy.getBySel('contract-input-btn-load').click();
				cy.wait('@runInvocation');
				cy.wait('@getInvocationWithContractId');
				cy.getBySel('tabs-function-title').should('have.text', 'Function');
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
				cy.get('.input-contract-name')
					.find('textarea')
					.click({ force: true })
					.type(contractId, { force: true });
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
