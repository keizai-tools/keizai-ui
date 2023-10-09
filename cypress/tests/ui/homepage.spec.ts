describe('Home page', () => {
	beforeEach(() => {
		cy.visit('/');
	});

	it('Should show tabs with functions', () => {
		const tabs = [
			'Functions',
			'Authorization',
			'Pre-invocate script',
			'Tests',
			'Events',
		];
		const contractImg = {
			alt: 'Load contract image',
			src: '/moon.svg',
			text: ["Let's Load", 'Your Contract'],
		};

		cy.getBySel('tabs-container').should('exist').and('be.visible');
		cy.getBySel('tabs-list-container')
			.should('be.visible')
			.find('button')
			.and('have.length', tabs.length)
			.each((item, index) => {
				cy.wrap(item).should('contain.text', tabs[index]);
			});
		cy.getBySel('tabs-content-container')
			.should('be.visible')
			.find('h2')
			.each((item, index) => {
				cy.wrap(item).should('have.text', contractImg.text[index]);
			});
		cy.getBySel('tabs-content-contract-img')
			.should('be.visible')
			.and('have.attr', 'alt', contractImg.alt)
			.and('have.attr', 'src', contractImg.src);
	});

	it('Should show a Breadcrumb', () => {
		const contractName = 'Counter contract / Basic use case /';

		cy.getBySel('breadcrumb-container').should('exist').and('be.visible');
		cy.getBySel('breadcrumb-contract-name').should(
			'contain.text',
			contractName,
		);
		cy.getBySel('breadcrumb-contract-invocation-name').should(
			'contain.text',
			'Get current counter',
		);
	});
	it('Should show a contract input', () => {
		const contractId =
			'f47e3e34187dc84aa9ff41108082d289cdf6e40720cdfba8fcd9974369b9d32e';

		cy.getBySel('contract-input-container').should('exist').and('be.visible');
		cy.getBySel('contract-input-network')
			.should('be.visible')
			.and('have.text', 'FUTURENET');
		cy.getBySel('input-contract-name')
			.should('be.visible')
			.and('have.value', contractId);
		cy.getBySel('contract-input-btn-load')
			.should('be.visible')
			.and('have.text', 'LOAD');
		cy.getBySel('contract-input-btn-load').realHover();
		cy.getBySel('contract-input-btn-load-tooltip')
			.should('be.visible')
			.and('contain', 'Coming soon');
	});
	it('Should show a Collections component', () => {
		cy.getBySel('collections-container').should('exist').and('be.visible');
		cy.getBySel('collections-header').should('exist').and('be.visible');
		cy.getBySel('collections-header-title')
			.should('be.visible')
			.and('have.text', 'Collections');
		cy.getBySel('collections-header-btn-new')
			.should('be.visible')
			.and('have.text', 'New');
		cy.getBySel('collections-header-btn-import')
			.should('be.visible')
			.and('have.text', 'Import');
	});
	it('Should show a terminal', () => {
		const terminalDefaultText = 'Welcome to keizai 0.1.0 - OUTPUT';

		cy.getBySel('terminal-container')
			.should('be.visible')
			.and('have.text', terminalDefaultText);
	});
	it('Should redirect to the Home page when navigating to other paths', () => {
		cy.visit('/aaa');
		cy.getBySel('home-page-container').should('be.visible');

		cy.visit('/bbb');
		cy.getBySel('home-page-container').should('be.visible');

		cy.visit('/ccc');
		cy.getBySel('home-page-container').should('be.visible');
	});
});
