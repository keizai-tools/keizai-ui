describe('Invocation management', () => {
	const keypair = {
		secretKey: {
			title: 'Secret key',
			key: 'SANEPI74NFPALZ4JOUTRBOUJGVFOFRKRQT2BZN3UR5ULVEN4FJKT7GRF',
			placeholder: 'S . . .',
			regex: /^S[0-9A-Z]{55}$/,
		},
		publicKey: {
			title: 'Public key',
			key: 'GA3I3AZQQXV7PSGOZ74JLDV7VEIUDEBMWHUTTTZLIBW3ZIJFWORTL2HF',
			placeholder: 'G . . .',
			regex: /^G[0-9A-Z]{55}$/,
		},
	};
	beforeEach(() => {
		cy.loginByCognitoApi();
		cy.visit('/');
		cy.getBySel('collection-folder-container').eq(0).click();
		cy.getBySel('folder-accordion-title').eq(0).click();
		cy.getBySel('invocation-list-container').eq(0).click({ force: true });
	});
	it('Should show a invocation section with tabs', () => {
		cy.getBySel('invocation-section-container').should('be.visible');
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
