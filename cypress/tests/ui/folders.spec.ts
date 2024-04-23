import { apiUrl, folderId, folders } from './exceptions/constants';

describe('Folders', () => {
	beforeEach(() => {
		cy.loginByCognitoApi();
	});
	describe('By User - [/user]', () => {
		beforeEach(() => {
			cy.intercept(`${Cypress.env('apiUrl')}/team`, {
				body: [],
			}).as('team');
			cy.wait('@team');
			cy.getBySel('home-workspace-list-user').click();
			cy.intercept('GET', `${apiUrl}/collection`, {
				fixture: './collections/collection-without-folders.json',
			}).as('getCollections');
			cy.wait('@getCollections');
			cy.getBySel('collection-folder-btn').click();
		});
		it('Should see the folders title', () => {
			cy.getBySel('collections-header-title').should(
				'have.text',
				folders.title,
			);
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
		it('Should add a new folder', () => {
			cy.intercept('GET', `${apiUrl}/collection/*/folders`, {
				fixture: './folders/one-folder-length.json',
			});
			cy.intercept('POST', `${apiUrl}/folder`, {
				fixture: './folders/new-folder.json',
			});

			cy.getBySel('collection-folder-container').should('not.exist');
			cy.getBySel('collections-header-btn-new').click();
			cy.getBySel('new-entity-dialog-container').should('be.visible');
			cy.getBySel('new-entity-dialog-title')
				.should('be.visible')
				.and('have.text', folders.dialog.create.title);
			cy.getBySel('new-entity-dialog-description')
				.should('be.visible')
				.and('have.text', folders.dialog.create.description);
			cy.getBySel('new-entity-dialog-form-container')
				.should('be.visible')
				.find('input')
				.and('have.value', folders.dialog.create.defaultValue);
			cy.getBySel('new-entity-dialog-btn-submit')
				.should('have.text', folders.dialog.create.btnText)
				.click();
			cy.getBySel('collection-folder-container').should('be.visible');
			cy.getBySel('collection-folder-name')
				.should('be.visible')
				.and('have.text', 'Folder');
		});
		it('Should show a folder', () => {
			cy.intercept('GET', `${apiUrl}/collection/*/folders`, {
				fixture: './folders/one-folder-length.json',
			});
			cy.intercept('POST', `${apiUrl}/folder`, {
				fixture: './folders/new-folder.json',
			}).as('createFolder');
			cy.getBySel('collections-header-btn-new').click();
			cy.getBySel('new-entity-dialog-btn-submit').click();
			cy.wait('@createFolder');

			cy.getBySel('collection-folder-container').should('be.visible');
			cy.getBySel('collection-folder-name')
				.should('be.visible')
				.and('have.text', 'Folder')
				.click();
			cy.getBySel('collection-folder-invocation-list').should('be.visible');
			cy.getBySel('collection-folder-new-invocation-btn').should('be.visible');
			cy.getBySel('new-invocation-btn-container')
				.should('be.visible')
				.contains(folders.newInvocationBtn);
			cy.getBySel('collection-options-container').should('not.exist');
			cy.getBySel('collection-options-btn').should('be.visible').click();
			cy.getBySel('collection-options-container').should('be.visible');
			cy.getBySel('collection-options-edit')
				.should('be.visible')
				.and('have.text', 'Edit');
			cy.getBySel('collection-options-delete')
				.should('be.visible')
				.and('have.text', 'Delete');
		});
		it('Should edit a folder', () => {
			const editedFolder = 'Edit Folder';

			cy.intercept('GET', `${apiUrl}/collection/*/folders`, {
				fixture: './folders/one-folder-length.json',
			}).as('getOneFolder');
			cy.wait('@getOneFolder');
			cy.intercept('PATCH', `${apiUrl}/folder`, {
				body: { name: editedFolder, id: folderId },
			}).as('editFolder');
			cy.intercept('GET', `${apiUrl}/collection/*/folders`, {
				fixture: './folders/edited-folder.json',
			}).as('getEditedFolder');

			cy.getBySel('collection-folder-container').should('be.visible');
			cy.getBySel('collection-folder-name').should('have.text', 'Folder');
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
				.and('have.text', folders.dialog.edit.title);
			cy.getBySel('edit-entity-dialog-description')
				.should('be.visible')
				.and('have.text', folders.dialog.edit.description);
			cy.getBySel('edit-entity-dialog-form-container').should('be.visible');
			cy.getBySel('edit-entity-dialog-form-container')
				.find('input')
				.type(editedFolder);
			cy.getBySel('edit-entity-dialog-btn-submit')
				.should('be.visible')
				.and('have.text', folders.dialog.edit.btnText)
				.click();

			cy.wait('@editFolder');
			cy.wait('@getEditedFolder');
			cy.getBySel('collection-folder-name').should('have.text', editedFolder);
		});
		it('Should delete a folder', () => {
			cy.intercept('GET', `${apiUrl}/collection/*/folders`, {
				fixture: './folders/one-folder-length.json',
			}).as('getOneFolder');
			cy.wait('@getOneFolder');
			cy.intercept('DELETE', `${apiUrl}/folder/*`, {
				fixture: './folders/one-folder-length.json',
			}).as('deleteFolder');
			cy.intercept('GET', `${apiUrl}/collection/*/folders`, {
				body: [],
			}).as('getWithoutFolder');

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
				.and('have.text', folders.dialog.delete.title);
			cy.getBySel('delete-entity-dialog-description')
				.should('be.visible')
				.and('have.text', folders.dialog.delete.description);
			cy.getBySel('delete-entity-dialog-btn-cancel')
				.should('be.visible')
				.and('have.text', folders.dialog.delete.btnCancelText);
			cy.getBySel('delete-entity-dialog-btn-continue')
				.should('be.visible')
				.and('have.text', folders.dialog.delete.btnContinueText)
				.click();

			cy.wait('@deleteFolder');
			cy.wait('@getWithoutFolder');
			cy.getBySel('collection-empty-folders')
				.should('be.visible')
				.and('have.text', folders.emptyFolderDescription);
		});
	});
	describe('By Team - [/team/:teamId]', () => {
		beforeEach(() => {
			cy.intercept(`${Cypress.env('apiUrl')}/team`, {
				fixture: './teams/all-teams.json',
			}).as('team');
			cy.wait('@team');
			cy.getBySel('home-workspace-list-team').eq(0).click();
			cy.intercept('GET', `${apiUrl}/team/*/collection`, {
				fixture: './collections/collection-without-folders.json',
			}).as('getCollections');
			cy.wait('@getCollections');
			cy.getBySel('collection-folder-btn').click();
		});
		it('Should see the folders title', () => {
			cy.getBySel('collections-header-title').should(
				'have.text',
				folders.title,
			);
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
		it('Should add a new folder', () => {
			cy.intercept('GET', `${apiUrl}/team/*/collection/*/folders`, {
				fixture: './folders/one-folder-length.json',
			});
			cy.intercept('POST', `${apiUrl}/team/*/folder`, {
				fixture: './folders/new-folder.json',
			});

			cy.getBySel('collection-folder-container').should('not.exist');
			cy.getBySel('collections-header-btn-new').click();
			cy.getBySel('new-entity-dialog-container').should('be.visible');
			cy.getBySel('new-entity-dialog-title')
				.should('be.visible')
				.and('have.text', folders.dialog.create.title);
			cy.getBySel('new-entity-dialog-description')
				.should('be.visible')
				.and('have.text', folders.dialog.create.description);
			cy.getBySel('new-entity-dialog-form-container')
				.should('be.visible')
				.find('input')
				.and('have.value', folders.dialog.create.defaultValue);
			cy.getBySel('new-entity-dialog-btn-submit')
				.should('have.text', folders.dialog.create.btnText)
				.click();
			cy.getBySel('collection-folder-container').should('be.visible');
			cy.getBySel('collection-folder-name')
				.should('be.visible')
				.and('have.text', 'Folder');
		});
		it('Should show a folder', () => {
			cy.intercept('GET', `${apiUrl}/team/*/collection/*/folders`, {
				fixture: './folders/one-folder-length.json',
			});
			cy.intercept('POST', `${apiUrl}/team/*/folder`, {
				fixture: './folders/new-folder.json',
			}).as('createFolder');
			cy.getBySel('collections-header-btn-new').click();
			cy.getBySel('new-entity-dialog-btn-submit').click();
			cy.wait('@createFolder');

			cy.getBySel('collection-folder-container').should('be.visible');
			cy.getBySel('collection-folder-name')
				.should('be.visible')
				.and('have.text', 'Folder')
				.click();
			cy.getBySel('collection-folder-invocation-list').should('be.visible');
			cy.getBySel('collection-folder-new-invocation-btn').should('be.visible');
			cy.getBySel('new-invocation-btn-container')
				.should('be.visible')
				.contains(folders.newInvocationBtn);
			cy.getBySel('collection-options-container').should('not.exist');
			cy.getBySel('collection-options-btn').should('be.visible').click();
			cy.getBySel('collection-options-container').should('be.visible');
			cy.getBySel('collection-options-edit')
				.should('be.visible')
				.and('have.text', 'Edit');
			cy.getBySel('collection-options-delete')
				.should('be.visible')
				.and('have.text', 'Delete');
		});
		it('Should edit a folder', () => {
			const editedFolder = 'Edit Folder';

			cy.intercept('GET', `${apiUrl}/team/*/collection/*/folders`, {
				fixture: './folders/one-folder-length.json',
			}).as('getOneFolder');
			cy.wait('@getOneFolder');
			cy.intercept('PATCH', `${apiUrl}/team/*/folder`, {
				body: { name: editedFolder, id: folderId },
			}).as('editFolder');
			cy.intercept('GET', `${apiUrl}/team/*/collection/*/folders`, {
				fixture: './folders/edited-folder.json',
			}).as('getEditedFolder');

			cy.getBySel('collection-folder-container').should('be.visible');
			cy.getBySel('collection-folder-name').should('have.text', 'Folder');
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
				.and('have.text', folders.dialog.edit.title);
			cy.getBySel('edit-entity-dialog-description')
				.should('be.visible')
				.and('have.text', folders.dialog.edit.description);
			cy.getBySel('edit-entity-dialog-form-container').should('be.visible');
			cy.getBySel('edit-entity-dialog-form-container')
				.find('input')
				.type(editedFolder);
			cy.getBySel('edit-entity-dialog-btn-submit')
				.should('be.visible')
				.and('have.text', folders.dialog.edit.btnText)
				.click();

			cy.wait('@editFolder');
			cy.wait('@getEditedFolder');
			cy.getBySel('collection-folder-name').should('have.text', editedFolder);
		});
		it('Should delete a folder', () => {
			cy.intercept('GET', `${apiUrl}/team/*/collection/*/folders`, {
				fixture: './folders/one-folder-length.json',
			}).as('getOneFolder');
			cy.wait('@getOneFolder');
			cy.intercept('DELETE', `${apiUrl}/team/*/folder/*`, {
				fixture: './folders/one-folder-length.json',
			}).as('deleteFolder');
			cy.intercept('GET', `${apiUrl}/team/*/collection/*/folders`, {
				body: [],
			}).as('getWithoutFolder');

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
				.and('have.text', folders.dialog.delete.title);
			cy.getBySel('delete-entity-dialog-description')
				.should('be.visible')
				.and('have.text', folders.dialog.delete.description);
			cy.getBySel('delete-entity-dialog-btn-cancel')
				.should('be.visible')
				.and('have.text', folders.dialog.delete.btnCancelText);
			cy.getBySel('delete-entity-dialog-btn-continue')
				.should('be.visible')
				.and('have.text', folders.dialog.delete.btnContinueText)
				.click();

			cy.wait('@deleteFolder');
			cy.wait('@getWithoutFolder');
			cy.getBySel('collection-empty-folders')
				.should('be.visible')
				.and('have.text', folders.emptyFolderDescription);
		});
	});
});
