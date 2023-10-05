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
	it('Should show a terminal', () => {
		const terminalDefaultText = 'Welcome to keizai 0.1.0 - OUTPUT';

		cy.getBySel('terminal-container')
			.should('be.visible')
			.and('have.text', terminalDefaultText);
	});
});
