import { collectionApiUrl, collections, folders } from './exceptions/contants';

describe('Collections', () => {
	beforeEach(() => {
		cy.loginByCognitoApi();
		cy.visit('/');
	});

	it('Should show a collection page of empty state', () => {
		cy.intercept('GET', collectionApiUrl, {
			body: [],
		}).as('getCollections');

		cy.wait('@getCollections');
		cy.getBySel('home-page-container').should('not.exist');
		cy.getBySel('collections-accordion-item').should('not.exist');
		cy.getBySel('collection-empty-state-container').should('be.visible');
		cy.getBySel('collections-header-title')
			.should('be.visible')
			.and('have.text', collections.pageTitle);
		cy.getBySel('collection-empty-state-img')
			.should('be.visible')
			.and('have.attr', 'alt', collections.img.emptyState.alt);
		cy.getBySel('collection-empty-state-img-title')
			.should('be.visible')
			.and('have.text', collections.img.emptyState.title);
		cy.getBySel('collections-header-btn-new')
			.should('be.visible')
			.and('have.text', collections.btnCreateText);
	});
	it('Should redirect to the Home page when navigating to other paths', () => {
		cy.intercept('GET', collectionApiUrl, {
			body: [],
		}).as('getCollections');

		cy.wait('@getCollections');
		cy.visit('/test');
		cy.getBySel('home-page-container').should('not.exist');
		cy.getBySel('collections-header-title').should('be.visible');
		cy.url().should('not.include', '/test');
	});
	it('Should show a create collection dialog', () => {
		cy.intercept('GET', collectionApiUrl, {
			body: [],
		}).as('getCollections');

		cy.wait('@getCollections');
		cy.getBySel('collections-header-btn-new').click();
		cy.getBySel('new-entity-dialog-container')
			.should('exist')
			.and('be.visible');
		cy.getBySel('new-entity-dialog-title')
			.should('be.visible')
			.and('have.text', collections.dialog.create.title);
		cy.getBySel('new-entity-dialog-description')
			.should('be.visible')
			.and('have.text', collections.dialog.create.description);
		cy.getBySel('new-entity-dialog-form-container')
			.find('input')
			.should('be.visible')
			.and('have.value', collections.dialog.create.defaultValue);
		cy.getBySel('new-entity-dialog-btn-submit')
			.should('be.visible')
			.and('have.text', collections.dialog.create.btnText);
	});
	it('Should create a new collection', () => {
		cy.intercept('GET', collectionApiUrl, {
			body: [],
		}).as('getCollections');
		cy.intercept('POST', collectionApiUrl, {
			fixture: './collections/new-collection.json',
		});

		cy.wait('@getCollections');
		cy.getBySel('new-entity-dialog-container').should('not.exist');
		cy.getBySel('collections-header-btn-new').click();
		cy.getBySel('new-entity-dialog-container')
			.should('exist')
			.and('be.visible');
		cy.getBySel('new-entity-dialog-btn-submit').click();
		cy.url().should('include', 'collection');
		cy.getBySel('collection-empty-state-container').should('not.exist');
		cy.getBySel('collection-empty-invocation-container')
			.should('exist')
			.and('be.visible');
		cy.getBySel('collection-empty-invocation-img')
			.should('be.visible')
			.and('have.attr', 'alt', collections.img.emptyInvocation.alt);
		cy.getBySel('collection-empty-invocation-description').should('be.visible');
		cy.getBySel('collection-empty-invocation-description')
			.find('h1')
			.should('have.text', collections.img.emptyInvocation.title[0]);
		cy.getBySel('collection-empty-invocation-description')
			.find('h3')
			.should('have.text', collections.img.emptyInvocation.title[1]);
		cy.getBySel('collections-header-title').should('have.text', folders.title);
		cy.getBySel('collection-loading')
			.should('be.visible')
			.and('have.text', folders.loadingDescription);
		cy.getBySel('collections-header-btn-new')
			.should('be.visible')
			.contains('Add');
		cy.getBySel('collection-empty-folders')
			.should('be.visible')
			.and('have.text', folders.emptyFolderDescription);
	});
	it('Should show a collection without folders when logging in', () => {
		cy.intercept('GET', collectionApiUrl, {
			fixture: './collections/collection-without-folders.json',
		}).as('getCollections');

		cy.wait('@getCollections');
		cy.getBySel('collections-header-title')
			.should('be.visible')
			.and('have.text', collections.pageTitle);
		cy.getBySel('collection-folder-container').should('be.visible');
		cy.getBySel('collection-options-btn').should('be.visible');
		cy.getBySel('collection-folder-quantity')
			.should('be.visible')
			.and('have.text', collections.folders.withoutFolder);
		cy.getBySel('collections-header-btn-new')
			.should('be.visible')
			.and('have.text', collections.btnCreateText);
	});
	it('Should show a collection with one folder when logging in', () => {
		cy.intercept('GET', collectionApiUrl, {
			fixture: './collections/collection-with-one-folder.json',
		}).as('getCollections');

		cy.wait('@getCollections');
		cy.getBySel('collections-header-title')
			.should('be.visible')
			.and('have.text', collections.pageTitle);
		cy.getBySel('collection-folder-container').should('be.visible');
		cy.getBySel('collection-options-btn').should('be.visible');
		cy.getBySel('collection-folder-quantity')
			.should('be.visible')
			.and('have.text', collections.folders.oneFolder);
		cy.getBySel('collections-header-btn-new')
			.should('be.visible')
			.and('have.text', collections.btnCreateText);
	});
	it('Should show a collection with two folders when logging in', () => {
		cy.intercept('GET', collectionApiUrl, {
			fixture: './collections/collection-with-two-folders.json',
		}).as('getCollections');

		cy.wait('@getCollections');
		cy.getBySel('collections-header-title')
			.should('be.visible')
			.and('have.text', collections.pageTitle);
		cy.getBySel('collection-folder-container').should('be.visible');
		cy.getBySel('collection-options-btn').should('be.visible');
		cy.getBySel('collection-folder-quantity')
			.should('be.visible')
			.and('have.text', collections.folders.twoFolders);
		cy.getBySel('collections-header-btn-new')
			.should('be.visible')
			.and('have.text', collections.btnCreateText);
	});
	it('Should edit a collection name', () => {
		const editedCollection = 'Edit Collection';

		cy.intercept('GET', collectionApiUrl, {
			fixture: './collections/collection-without-folders.json',
		}).as('getCollections');
		cy.intercept('PATCH', collectionApiUrl, {
			fixture: './collections/edited-collection.json',
		}).as('editCollection');

		cy.wait('@getCollections');
		cy.getBySel('collection-folder-container').should('be.visible');
		cy.getBySel('collection-folder-title').should('have.text', 'Collection');
		cy.getBySel('collection-options-btn').click();
		cy.getBySel('collection-options-container')
			.should('exist')
			.and('be.visible');
		cy.getBySel('collection-options-edit')
			.should('be.visible')
			.and('have.text', 'Edit')
			.click();

		cy.getBySel('edit-entity-dialog-container')
			.should('exist')
			.and('be.visible');
		cy.getBySel('edit-entity-dialog-title')
			.should('be.visible')
			.and('have.text', collections.dialog.edit.title);
		cy.getBySel('edit-entity-dialog-description')
			.should('be.visible')
			.and('have.text', collections.dialog.edit.description);
		cy.getBySel('edit-entity-dialog-form-container').should('be.visible');
		cy.getBySel('edit-entity-dialog-form-container')
			.find('input')
			.type(editedCollection);
		cy.getBySel('edit-entity-dialog-btn-submit')
			.should('be.visible')
			.and('have.text', collections.dialog.edit.btnText)
			.click();

		cy.wait('@editCollection');
		cy.getBySel('collection-folder-title').should(
			'have.text',
			editedCollection,
		);
	});
	it('Should delete a collection', () => {
		cy.intercept('GET', collectionApiUrl, {
			fixture: './collections/collection-without-folders.json',
		}).as('getCollections');
		cy.intercept('DELETE', `${collectionApiUrl}/${collections.id}`, {
			body: collections.id,
		}).as('deleteCollection');
		cy.wait('@getCollections');
		cy.intercept('GET', collectionApiUrl, {
			body: [],
		}).as('getCollectionsWithoutCollection');

		cy.getBySel('collection-folder-container').should('be.visible');
		cy.getBySel('collection-options-btn').click();
		cy.getBySel('collection-options-container')
			.should('exist')
			.and('be.visible');
		cy.getBySel('collection-options-delete')
			.should('be.visible')
			.and('have.text', 'Delete')
			.click();

		cy.getBySel('delete-entity-dialog-container')
			.should('exist')
			.and('be.visible');
		cy.getBySel('delete-entity-dialog-title')
			.should('be.visible')
			.and('have.text', collections.dialog.delete.title);
		cy.getBySel('delete-entity-dialog-description')
			.should('be.visible')
			.and('have.text', collections.dialog.delete.description);
		cy.getBySel('delete-entity-dialog-btn-cancel')
			.should('be.visible')
			.and('have.text', collections.dialog.delete.btnCancelText);
		cy.getBySel('delete-entity-dialog-btn-continue')
			.should('be.visible')
			.and('have.text', collections.dialog.delete.btnContinueText)
			.click();

		cy.wait('@deleteCollection');
		cy.getBySel('collection-empty-state-container').should('be.visible');
	});
});
