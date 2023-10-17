describe('Home page', () => {
	beforeEach(() => {
		cy.visit('/');
	});

	describe('Invocation Page', () => {
		it('Should show a Invocation Page', () => {
			const invocationImg = {
				alt: 'New collection image',
				src: '/blocks.svg',
			};
			const invocationDescription = {
				text: 'Create your first collection',
				btnText: 'New collection',
			};

			cy.getBySel('invocation-page-container')
				.should('exist')
				.and('be.visible');
			cy.getBySel('home-page-container').should('not.exist');
			cy.getBySel('invocation-page-img')
				.should('be.visible')
				.and('have.attr', 'alt', invocationImg.alt)
				.and('have.attr', 'src', invocationImg.src);
			cy.getBySel('invocation-page-description').should(
				'have.text',
				invocationDescription.text,
			);
			cy.getBySel('invocation-page-btn').should(
				'have.text',
				invocationDescription.btnText,
			);
		});
		it('Should redirect to the Home page when navigating to other paths', () => {
			cy.visit('/aaa');
			cy.getBySel('invocation-page-container').should('be.visible');

			cy.visit('/bbb');
			cy.getBySel('invocation-page-container').should('be.visible');

			cy.visit('/ccc');
			cy.getBySel('invocation-page-container').should('be.visible');
		});
	});
	describe('Contract Page', () => {
		beforeEach(() => {
			cy.getBySel('invocation-page-container')
				.should('exist')
				.and('be.visible');
			cy.getBySel('home-page-container').should('not.exist');
			cy.getBySel('collections-header-btn-new').click();
			cy.getBySel('invocation-page-container').should('not.exist');
			cy.getBySel('home-page-container').should('exist').and('be.visible');
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
			cy.getBySel('contract-input-container').should('exist').and('be.visible');
			cy.getBySel('contract-input-network')
				.should('be.visible')
				.and('have.text', 'FUTURENET');
			cy.getBySel('input-contract-name')
				.should('be.visible')
				.and('have.attr', 'placeholder', 'Contract address');
			cy.getBySel('contract-input-btn-load')
				.should('be.visible')
				.and('have.text', 'LOAD');
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
	});
});
