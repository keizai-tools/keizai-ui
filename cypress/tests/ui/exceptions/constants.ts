export const collectionId = 'fe9abbf4-8afc-4109-b31e-fe422b84c5b5';
export const invocationId = '635bbf80-0787-47e2-900c-f44d5f53559d';
export const contractId =
	'CAMNDFGZCEVIQGKG5USNUFUVT3O4PJWGN4FVATNIRND6TJCG3CC2UW75';
export const stellarFriendBotUrl = '';
export const keypair = {
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
export const invocations = {
	default: {
		contract: {
			network: 'FUTURENET',
			placeholder: 'Contract address',
			btnLoadText: 'LOAD',
		},
		img: {
			alt: 'Load contract image',
			title: ["Let's Load", 'Your Contract.'],
			subtitle: 'Input your contract address above to begin.',
		},
	},
	tabs: {
		functions: {
			title: 'Function',
			selectPlaceholder: 'Select function',
		},
	},
	dialog: {
		create: {
			title: 'New invocation',
			description: "Let's name your invocation",
			defaultInputValue: 'Invocation',
			btnText: 'Create',
		},
		edit: {
			title: 'Edit invocation',
			description: "Let's name your invocation",
			btnText: 'Save',
		},
		delete: {
			title: 'Are you sure?',
			description: 'This will permanently delete your invocation.',
			btnCancelText: 'Cancel',
			btnContinueText: 'Continue',
		},
	},
};

export const environments = {
	id: 'e3133823-566a-4436-948d-832672cf44bc',
	linkName: 'Collection variables',
	header: {
		title: 'Collections variables',
		collectionName: 'Collection 1',
	},
	button: {
		addName: 'Add new',
		saveName: 'Save',
	},
	input: {
		namePlaceholder: 'Name',
		valuePlaceholder: 'Value',
		key: 'name',
		value: 'test',
		editedKey: 'edit name',
		editedValue: 'edit test',
	},
};
