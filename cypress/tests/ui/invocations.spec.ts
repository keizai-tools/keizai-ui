describe('Invocation management', () => {
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
		const authentication = {
			title: ['SET YOUR', 'AUTHENTICATION'],
			img: {
				alt: 'Authentication image',
			},
			btnTitle: ['Generate new account', 'Import account'],
		};
		cy.getBySel('functions-tabs-authorizations').click();
		cy.getBySel('auth-tab-container').should('be.visible');
		cy.getBySel('auth-tab-header-container').should('be.visible');
		cy.getBySel('auth-tab-account-text')
			.should('be.visible')
			.find('h2')
			.then((title) => {
				expect(title[0]).to.contain.text(authentication.title[0]);
				expect(title[1]).to.contain.text(authentication.title[1]);
			});
		cy.getBySel('auth-tab-account-img')
			.should('be.visible')
			.and('have.attr', 'alt', authentication.img.alt);
		cy.getBySel('auth-soroban-create-account-btn')
			.should('be.visible')
			.and('have.text', authentication.btnTitle[0]);
		cy.getBySel('auth-soroban-import-account-btn')
			.should('be.visible')
			.and('have.text', authentication.btnTitle[1]);
	});
	it('Should show a modal to generate a new account', () => {
		const createAccount = {
			title: 'Generate a new keypair',
			publicKey: 'PUBLIC KEY',
			secretKey: 'SECRET KEY',
			copyKey: 'Copy keys',
			inputSave: "I've stored my secret key in a safe place",
			button: 'Close',
		};
		cy.getBySel('functions-tabs-authorizations').click();
		cy.getBySel('auth-soroban-create-account-btn').click();
		cy.getBySel('auth-soroban-create-account-container').should('be.visible');
		cy.getBySel('auth-soroban-create-account-title')
			.should('be.visible')
			.and('have.text', createAccount.title);
		cy.getBySel('auth-soroban-create-account-description').should('be.visible');
		cy.getBySel('auth-soroban-create-account-keys-container').should(
			'be.visible',
		);
		cy.getBySel('auth-soroban-create-account-public-container').should(
			'be.visible',
		);
		cy.getBySel('auth-soroban-create-account-public-container')
			.find('h4')
			.should('be.visible')
			.should('have.text', createAccount.publicKey);
		cy.getBySel('auth-soroban-create-account-public-container')
			.find('code')
			.should('be.visible');
		cy.getBySel('auth-soroban-create-account-secret-container').should(
			'be.visible',
		);
		cy.getBySel('auth-soroban-create-account-secret-container')
			.find('h4')
			.should('be.visible')
			.should('have.text', createAccount.secretKey);
		cy.getBySel('auth-soroban-create-account-secret-container')
			.find('code')
			.should('be.visible');

		cy.getBySel('auth-soroban-create-account-copy-text-container').should(
			'be.visible',
		);

		cy.getBySel('auth-soroban-create-account-btn-copy-keys')
			.should('be.visible')
			.find('span')
			.and('have.text', createAccount.copyKey);
		cy.getBySel('auth-soroban-create-account-tooltip-copied').should(
			'not.exist',
		);
		cy.getBySel('auth-soroban-create-account-btn-submit')
			.should('be.visible')
			.and('be.disabled');
		cy.getBySel('auth-soroban-create-account-stored-container')
			.should('be.visible')
			.find('label')
			.and('have.text', createAccount.inputSave);
		cy.getBySel('auth-soroban-create-account-stored-container')
			.find('button')
			.click();
		cy.getBySel('auth-soroban-create-account-btn-submit')
			.should('be.visible')
			.and('not.be.disabled')
			.click();
		cy.getBySel('auth-soroban-create-account-container').should('not.exist');
		cy.getBySel('invocation-section-container').should('be.visible');
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
		const signerAccount = {
			publicKey: 'GA3I3AZQQXV7PSGOZ74JLDV7VEIUDEBMWHUTTTZLIBW3ZIJFWORTL2HF',
			secretKey: 'SANEPI74NFPALZ4JOUTRBOUJGVFOFRKRQT2BZN3UR5ULVEN4FJKT7GRF',
		};
		cy.getBySel('functions-tabs-authorizations').click();
		cy.getBySel('auth-soroban-import-account-btn').click();
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
		cy.getBySel('import-account-modal-input').type(signerAccount.publicKey);
		cy.getBySel('import-account-modal-error')
			.should('be.visible')
			.and('have.text', importAccount.error.invalidSecretKey);
		cy.getBySel('import-account-modal-input').clear();
		cy.getBySel('import-account-modal-input')
			.should('be.visible')
			.type(signerAccount.secretKey);
		cy.getBySel('import-account-modal-btn-submit')
			.should('be.visible')
			.and('have.text', importAccount.button)
			.click();

		cy.getBySel('import-account-modal-container').should('not.exist');
		cy.getBySel('invocation-section-container').should('be.visible');
	});
});
