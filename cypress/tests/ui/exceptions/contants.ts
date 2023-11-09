export const collectionApiUrl = `${Cypress.env('apiUrl')}/collection`;

export const collections = {
	id: '45cb5f2a-5c38-4cef-a0ac-bb292682c018',
	pageTitle: 'Collections',
	btnCreateText: 'Create a new collection',
	img: {
		emptyState: {
			alt: 'Empty state',
			title:
				'Group related invocations in collections for quick access and smooth workflows.',
		},
		emptyInvocation: {
			alt: 'No invocation selected',
			title: ['Select an invocation from the sidebar', 'Or create a new one'],
		},
	},
	dialog: {
		create: {
			title: 'New collection',
			description: "Let's name your collection",
			defaultValue: 'Collection',
			btnText: 'Create',
		},
		edit: {
			title: 'Edit collection',
			description: "Let's name your collection",
			btnText: 'Save',
		},
		delete: {
			title: 'Are you sure?',
			description:
				'This will permanently delete your collection and all of its contents.',
			btnCancelText: 'Cancel',
			btnContinueText: 'Continue',
		},
	},
	folders: {
		withoutFolder: 'No folders',
		oneFolder: '1 Folder',
		twoFolders: '2 Folders',
	},
};
export const folders = {
	title: 'Folders',
	loadingDescription: 'Loading folders...',
	emptyFolderDescription: 'Create your first folder here',
	dialog: {
		create: {
			title: 'New folder',
			description: "Let's name your folder",
			defaultValue: 'Folder',
			btnText: 'Create',
		},
	},
};
