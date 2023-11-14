import {
	collectionId,
	invocationId,
	keypair,
	invocations,
	stellarFriendBotUrl,
} from './exceptions/constants';

describe('Invocation', () => {
	beforeEach(() => {
		cy.loginByCognitoApi();
		cy.intercept('GET', `${Cypress.env('apiUrl')}/collection`, {
			fixture: './collections/collection-with-one-folder.json',
		}).as('getCollections');
		cy.wait('@getCollections');
		cy.getBySel('collection-folder-btn').click();
	});
	describe('Without invocation', () => {
		beforeEach(() => {
			cy.intercept(
				'GET',
				`${Cypress.env('apiUrl')}/collection/${collectionId}/folders`,
				{ fixture: './folders/one-folder-length.json' },
			).as('getOneFolder');
			cy.wait('@getOneFolder');
		});
		it('Should create a new invocation', () => {
			cy.intercept('POST', `${Cypress.env('apiUrl')}/invocation`, {
				fixture: './invocations/one-invocation.json',
			}).as('createInvocation');
			cy.intercept(
				'GET',
				`${Cypress.env('apiUrl')}/collection/${collectionId}/folders`,
				{
					fixture: './folders/one-folder-with-one-invocation.json',
				},
			).as('getFolderWithOneInvocation');
			cy.intercept(
				'GET',
				`${Cypress.env('apiUrl')}/invocation/${invocationId}`,
				{
					fixture: './folders/one-folder-with-one-invocation.json',
				},
			).as('getInvocation');

			cy.getBySel('collection-folder-name').click();
			cy.getBySel('new-entity-dialog-container').should('not.exist');
			cy.getBySel('new-invocation-btn-container').should('be.visible').click();
			cy.getBySel('new-entity-dialog-container').should('be.visible');
			cy.getBySel('new-entity-dialog-title')
				.should('be.visible')
				.and('have.text', invocations.dialog.create.title);
			cy.getBySel('new-entity-dialog-description')
				.should('be.visible')
				.and('have.text', invocations.dialog.create.description);
			cy.getBySel('new-entity-dialog-form-container')
				.should('be.visible')
				.find('input')
				.and('have.value', invocations.dialog.create.defaultInputValue);
			cy.getBySel('new-entity-dialog-btn-submit')
				.should('have.text', invocations.dialog.create.btnText)
				.click();

			cy.wait('@createInvocation');
			cy.wait('@getInvocation');
			cy.getBySel('collection-empty-invocation-container').should('not.exist');
			cy.getBySel('tabs-container').should('be.visible');
			cy.getBySel('collection-folder-name')
				.eq(1)
				.should('be.visible')
				.and('have.text', 'Invocation');
		});
	});
	describe('With one invocation', () => {
		beforeEach(() => {
			cy.intercept('POST', `${Cypress.env('apiUrl')}/invocation`, {
				fixture: './invocations/one-invocation.json',
			}).as('createInvocation');
			cy.intercept(
				'GET',
				`${Cypress.env('apiUrl')}/collection/${collectionId}/folders`,
				{
					fixture: './folders/one-folder-with-one-invocation.json',
				},
			).as('getFolderWithOneInvocation');
			cy.intercept(
				'GET',
				`${Cypress.env('apiUrl')}/invocation/${invocationId}`,
				{
					fixture: './folders/one-folder-with-one-invocation.json',
				},
			).as('getInvocation');

			cy.getBySel('collection-folder-name').click();
			cy.getBySel('new-invocation-btn-container').click();
			cy.getBySel('new-entity-dialog-btn-submit').click();

			cy.wait('@createInvocation');
			cy.wait('@getInvocation');
		});
		it('Should edit a invocation name', () => {
			const editInvocation = 'Edit Invocation';

			cy.intercept('PATCH', `${Cypress.env('apiUrl')}/invocation`, {
				body: {
					id: invocationId,
					name: editInvocation,
				},
			}).as('editInvocation');
			cy.intercept(
				'GET',
				`${Cypress.env('apiUrl')}/collection/${collectionId}/folders`,
				{
					fixture: './folders/folder-with-edited-invocation.json',
				},
			).as('getFolderWithEditedInvocation');
			cy.intercept(
				'GET',
				`${Cypress.env('apiUrl')}/invocation/${invocationId}`,
				{
					fixture: './invocations/edited-invocation.json',
				},
			).as('getEditedInvocation');

			cy.getBySel('collection-options-container').should('not.exist');
			cy.getBySel('collection-options-btn').eq(1).realHover().click();
			cy.getBySel('collection-options-container').should('be.visible');
			cy.getBySel('edit-entity-dialog-container').should('not.exist');
			cy.getBySel('collection-options-edit').click();
			cy.getBySel('edit-entity-dialog-container').should('be.visible');
			cy.getBySel('edit-entity-dialog-title')
				.should('be.visible')
				.and('have.text', invocations.dialog.edit.title);
			cy.getBySel('edit-entity-dialog-description')
				.should('be.visible')
				.and('have.text', invocations.dialog.edit.description);
			cy.getBySel('edit-entity-dialog-form-container')
				.should('be.visible')
				.find('input')
				.type(editInvocation);
			cy.getBySel('edit-entity-dialog-btn-submit')
				.should('be.visible')
				.and('have.text', invocations.dialog.edit.btnText)
				.click();

			cy.wait('@editInvocation');
			cy.wait('@getFolderWithEditedInvocation');
			// cy.wait('@getEditedInvocation');

			cy.getBySel('collection-folder-name')
				.eq(1)
				.should('be.visible')
				.and('have.text', editInvocation);
		});
		it('Should delete a invocation', () => {
			cy.intercept(
				'DELETE',
				`${Cypress.env('apiUrl')}/invocation/${invocationId}`,
				{
					body: {
						id: invocationId,
					},
				},
			).as('deleteInvocation');
			cy.intercept(
				'GET',
				`${Cypress.env('apiUrl')}/collection/${collectionId}/folders`,
				{
					fixture: './folders/one-folder-with-one-invocation.json',
				},
			).as('getFolderWithOneInvocation');

			cy.getBySel('collection-options-container').should('not.exist');
			cy.getBySel('collection-options-btn').eq(1).realHover().click();
			cy.getBySel('collection-options-container').should('be.visible');
			cy.getBySel('delete-entity-dialog-container').should('not.exist');
			cy.getBySel('collection-options-delete').click();
			cy.getBySel('delete-entity-dialog-container').should('be.visible');
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
			cy.wait('@getFolderWithOneInvocation');
			cy.getBySel('collections-header-title')
				.should('be.visible')
				.and('have.text', 'Collections');
		});
		it('Should show a invocation without contract', () => {
			cy.getBySel('invocation-section-container').should('be.visible');
			cy.getBySel('contract-input-container').should('be.visible');
			cy.getBySel('contract-input-network')
				.should('be.visible')
				.and('have.text', invocations.default.contract.network);
			cy.getBySel('input-contract-name')
				.should('be.visible')
				.and(
					'have.attr',
					'placeholder',
					invocations.default.contract.placeholder,
				);
			cy.getBySel('contract-input-btn-load')
				.should('be.visible')
				.and('have.text', invocations.default.contract.btnLoadText);

			cy.getBySel('tabs-container').should('be.visible');
			cy.getBySel('tabs-list-container').should('be.visible');
			cy.getBySel('tabs-content-container').should('be.visible');
			cy.getBySel('tabs-content-contract-img')
				.should('be.visible')
				.and('have.attr', 'alt', invocations.default.img.alt);
			cy.getBySel('tabs-content-contract-text')
				.should('be.visible')
				.find('h2')
				.each((title, index) => {
					cy.wrap(title).should(
						'contain.text',
						invocations.default.img.title[index],
					);
				});
			cy.getBySel('tabs-content-contract-description')
				.should('be.visible')
				.and('have.text', invocations.default.img.subtitle);
			cy.getBySel('tabs-content-container').should('be.visible');
		});
		it.only('Should load a contract', () => {
			const contractId =
				'CAABIHUZVHWJEQZ4LZWK5644HOWRPYHWGRUY4L5TBHUDHFADDVY55BK6';

			cy.intercept('PATCH', `${Cypress.env('apiUrl')}/invocation`, {
				fixture: './invocations/invocation-with-contract-id.json',
			}).as('loadContract');
			// cy.intercept(
			// 	'GET',
			// 	`${Cypress.env('apiUrl')}/invocation/${invocationId}`,
			// 	{
			// 		fixture: './invocations/invocation-with-contract-id.json',
			// 	},
			// ).as('getContract');
			cy.intercept(
				'GET',
				`${Cypress.env('apiUrl')}/invocation/${invocationId}`,
				{
					fixture: './folders/folder-with-contract-id.json',
				},
			).as('folderWithContract');

			cy.getBySel('input-contract-name').type(contractId);
			cy.getBySel('contract-input-btn-load').click();
			cy.wait('@loadContract');
			// cy.wait('@folderWithContract');

			// cy.getBySel('tabs-function-container').should('be.visible');
			// cy.getBySel('tabs-function-title')
			// 	.should('be.visible')
			// 	.and('have.text', invocations.tabs.functions.title);
			// cy.getBySel('tabs-function-select-container').should('be.visible');
			// cy.getBySel('tabs-function-select-default')
			// 	.should('be.visible')
			// 	.and('have.text', invocations.tabs.functions.selectPlaceholder);
		});
		it('Should show the Authentication tab', () => {
			const btnTitle = ['Generate new account', 'Import account'];

			cy.getBySel('functions-tabs-authorization').click();
			cy.getBySel('auth-tab-container').should('be.visible');
			cy.getBySel('auth-tab-secret-key').should('be.visible');
			cy.getBySel('auth-tab-secret-key')
				.find('span')
				.should('have.text', keypair.secretKey.title);
			cy.getBySel('auth-tab-secret-key')
				.find('input')
				.should('have.attr', 'placeholder', keypair.secretKey.placeholder);
			cy.getBySel('auth-tab-public-key').should('be.visible');
			cy.getBySel('auth-tab-public-key')
				.find('span')
				.should('have.text', keypair.publicKey.title);
			cy.getBySel('auth-tab-public-key')
				.find('input')
				.should('have.attr', 'placeholder', keypair.publicKey.placeholder);
			cy.getBySel('auth-stellar-create-account-btn')
				.should('be.visible')
				.and('have.text', btnTitle[0]);
			cy.getBySel('auth-stellar-import-account-btn')
				.should('be.visible')
				.and('have.text', btnTitle[1]);
		});
		it('Should generate a new account and display keypair', () => {
			cy.intercept('GET', `${stellarFriendBotUrl}${keypair.publicKey}`, {
				body: {
					addr: keypair.publicKey,
				},
			}).as('stellarFriendbot');
			cy.intercept('PATCH', `${Cypress.env('apiUrl')}/invocation`, {
				fixture: './invocations/one-invocation-with-keypair.json',
			}).as('generateNewAccountKeypair');

			cy.getBySel('functions-tabs-authorization').click();
			cy.getBySel('auth-tab-secret-key')
				.should('be.visible')
				.find('input')
				.invoke('val')
				.should('contain', '');
			cy.getBySel('auth-tab-public-key')
				.should('be.visible')
				.find('input')
				.invoke('val')
				.should('contain', '');

			cy.getBySel('auth-stellar-create-account-btn').click();
			cy.wait('@generateNewAccountKeypair');

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
		it('Should show a modal to connect with private key', () => {
			cy.intercept('PATCH', `${Cypress.env('apiUrl')}/invocation`, {
				fixture: './invocations/one-invocation-with-keypair.json',
			}).as('importSecretKey');

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
	});
});
