describe('Collections', () => {
	beforeEach(() => {
		cy.loginByCognitoApi();
		cy.visit('/');
	});

	it('Should show the Collections header', () => {
		cy.getBySel('invocation-page-container').should('exist').and('be.visible');
		cy.getBySel('home-page-container').should('not.exist');
		cy.getBySel('collections-accordion-item').should('not.exist');
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
	it('Should create a new collection by clicking the New button in the header', () => {
		cy.getBySel('invocation-page-container').should('exist').and('be.visible');
		cy.getBySel('home-page-container').should('not.exist');
		cy.getBySel('collections-accordion-item').should('not.exist');
		cy.getBySel('collections-header-btn-new').click();
		cy.getBySel('invocation-page-container').should('not.exist');
		cy.getBySel('home-page-container').should('exist').and('be.visible');
		cy.getBySel('collections-accordion-item').should('have.length', 1);
		cy.getBySel('collections-accordion-item').should('exist').and('be.visible');
		cy.getBySel('collection-item-name').should('have.text', 'New collection 1');
		cy.getBySel('collection-options-btn').should('exist').and('be.visible');
	});
	it('Should create a new collection by clicking the New Collection button', () => {
		cy.getBySel('invocation-page-container').should('exist').and('be.visible');
		cy.getBySel('home-page-container').should('not.exist');
		cy.getBySel('collections-accordion-item').should('not.exist');
		cy.getBySel('invocation-page-btn').click();
		cy.getBySel('invocation-page-container').should('not.exist');
		cy.getBySel('home-page-container').should('exist').and('be.visible');
		cy.getBySel('collections-accordion-container').should('have.length', 1);
		cy.getBySel('collections-accordion-item').should('exist').and('be.visible');
		cy.getBySel('collection-item-name').should('have.text', 'New collection 1');
		cy.getBySel('collection-options-btn').should('exist').and('be.visible');
	});
	it('Should show a message with empty folders', () => {
		cy.getBySel('collections-header-btn-new').click();
		cy.getBySel('collection-empty-folders').should('not.exist');
		cy.getBySel('collection-item-btn').click();
		cy.getBySel('collection-empty-folders')
			.should('exist')
			.and('be.visible')
			.and('have.text', 'No folders');
	});
	it('Should create various collections', () => {
		cy.getBySel('collections-header-btn-new').click();
		cy.getBySel('collection-item-name').should('have.text', 'New collection 1');
		for (let i = 2; i < 7; i++) {
			const index = i - 1;
			cy.getBySel('collections-header-btn-new').click();
			cy.getBySel('collections-accordion-item').should('have.length', i);
			cy.getBySel('collection-item-name')
				.eq(index)
				.should('have.text', `New collection ${i}`);
			cy.getBySel('collection-options-btn')
				.eq(index)
				.should('exist')
				.and('be.visible');
		}
	});
	it('Should delete a collection', () => {
		cy.getBySel('collections-header-btn-new').click();
		cy.getBySel('collections-accordion-item').should('have.length', 1);
		cy.getBySel('collection-options-btn').click();
		cy.getBySel('collection-options-delete').click();
		cy.getBySel('collections-accordion-item').should('have.length', 0);
	});
	it('Should show the collection options', () => {
		cy.getBySel('collections-header-btn-new').click();
		cy.getBySel('collection-options-container').should('not.exist');
		cy.getBySel('collection-options-btn')
			.should('exist')
			.and('be.visible')
			.click();
		cy.getBySel('collection-options-container')
			.should('exist')
			.and('be.visible');
		cy.getBySel('collection-options-add')
			.should('be.visible')
			.and('have.text', 'Add Folder');
		cy.getBySel('collection-options-edit')
			.should('be.visible')
			.and('have.text', 'Edit');
		cy.getBySel('collection-options-delete')
			.should('be.visible')
			.and('have.text', 'Delete');
		cy.getBySel('collection-options-edit').realHover();
		cy.getBySel('collection-options-edit-tooltip')
			.should('be.visible')
			.and('contain', 'Coming soon');
	});
	it('Should be able to create a new folder', () => {
		cy.getBySel('collections-header-btn-new').click();
		cy.getBySel('collection-item-btn').click();
		cy.getBySel('collection-empty-folders')
			.should('exist')
			.and('be.visible')
			.and('have.text', 'No folders');
		cy.getBySel('collection-options-btn').click();
		cy.getBySel('collection-options-add').click();
		cy.getBySel('collection-folder-container')
			.should('exist')
			.and('be.visible');
		cy.getBySel('collection-options-container').should('not.exist');
		cy.getBySel('collection-folder-name').should('have.text', 'New Folder');
		cy.getBySel('collection-folder-btn-delete')
			.realHover()
			.should('exist')
			.and('be.visible');
		cy.getBySel('collection-folder-container').click();
		cy.getBySel('collection-folder-invocations')
			.should('be.visible')
			.and('have.text', 'No invocations');
	});
	it('Should be able to delete a folder', () => {
		cy.getBySel('collections-header-btn-new').click();
		cy.getBySel('collection-item-btn').click();
		cy.getBySel('collection-empty-folders')
			.should('exist')
			.and('be.visible')
			.and('have.text', 'No folders');
		cy.getBySel('collection-options-btn').click();
		cy.getBySel('collection-options-add').click();
		cy.getBySel('collection-options-container').should('not.exist');
		cy.getBySel('collection-folder-container')
			.should('exist')
			.and('be.visible');
		cy.getBySel('collection-folder-btn-delete').realHover().click();
		cy.getBySel('collection-folder-container').should('not.exist');
		cy.getBySel('collection-empty-folders')
			.should('exist')
			.and('be.visible')
			.and('have.text', 'No folders');
	});
});
