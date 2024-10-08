export const collectionId = 'fe9abbf4-8afc-4109-b31e-fe422b84c5b5';
export const folderId = 'c1f7a826-acdd-446b-97b2-1600fddc8023';
export const invocationId = '635bbf80-0787-47e2-900c-f44d5f53559d';
export const environmentId = 'e3133823-566a-4436-948d-832672cf44bc';
export const contractId =
  'CAMNDFGZCEVIQGKG5USNUFUVT3O4PJWGN4FVATNIRND6TJCG3CC2UW75';
export const apiUrl = `${Cypress.env('apiUrl')}`;

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

export const collections = {
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
    delete: {
      title: 'Are you sure?',
      description:
        'This will permanently delete your folder and all related invocations.',
      btnCancelText: 'Cancel',
      btnContinueText: 'Continue',
    },
    edit: {
      title: 'Edit folder',
      description: "Let's name your folder",
      btnText: 'Save',
    },
  },
  newInvocationBtn: 'Add invocation',
};

export const invocations = {
  default: {
    contract: {
      network: 'FUTURENET',
      placeholder: 'Contract address',
      btnLoadText: 'LOAD',
      environmentValue: '{{contract_id}}',
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
    events: {
      imgAlt: 'Search events',
      title: ['Run the contract', 'to see the events'],
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
    error: {
      name: {
        empty: 'The name cannot be empty',
        exist: 'A variable with this name already exists',
      },
      value: {
        empty: 'The value cannot be empty',
      },
    },
  },
  emptyStateText: "You don't have any variables created",
  list: [
    {
      name: 'inc1',
      value: '1',
      id: '1585c667-114a-49c2-ba05-60847e7da0df',
    },
    {
      name: 'inc2',
      value: '2',
      id: '55cb9562-e6d7-4586-b099-571c058d3f69',
    },
    {
      name: 'inc3',
      value: '3',
      id: '7995f0d5-12ba-4ad5-97c5-f7d9fa9a5b0d',
    },
  ],
};

export const events = [
  {
    type: 'diagnostic',
    ledger: 344395,
    ledgerClosedAt: '2023-12-28T19:09:37Z',
    id: '0001479165261910016-0000000001',
    pagingToken: '0001479165261910016-0000000001',
    topic: ['fn_return', 'inc_by'],
    value: 304,
    inSuccessfulContractCall: true,
    contractId: 'CD2FKDTRHHUX3JOGYAWU3CTWW7DOC6J2H2E6KHF3YU74OWNWNFWWW2X3',
  },
  {
    type: 'diagnostic',
    ledger: 343851,
    ledgerClosedAt: '2023-12-28T18:21:39Z',
    id: '0001476828799705088-0000000001',
    pagingToken: '0001476828799705088-0000000001',
    topic: ['fn_return', 'inc_by'],
    value: 303,
    inSuccessfulContractCall: true,
    contractId: 'CD2FKDTRHHUX3JOGYAWU3CTWW7DOC6J2H2E6KHF3YU74OWNWNFWWW2X3',
  },
  {
    type: 'diagnostic',
    ledger: 343344,
    ledgerClosedAt: '2023-12-28T17:37:15Z',
    id: '0001474651251286016-0000000001',
    pagingToken: '0001474651251286016-0000000001',
    topic: ['fn_return', 'increment'],
    value: 302,
    inSuccessfulContractCall: true,
    contractId: 'CD2FKDTRHHUX3JOGYAWU3CTWW7DOC6J2H2E6KHF3YU74OWNWNFWWW2X3',
  },
];

export const changeNetwork = {
  alertDialog: {
    header: 'Update Network',
    title: 'Warning!',
    description:
      'This will remove your current loaded contract, keys, functions and parameters.',
    btnCancel: 'Cancel',
    btnConfirm: 'Change',
  },
};

export enum NETWORK {
  FUTURENET = 'FUTURENET',
  TESTNET = 'TESTNET',
}

export const terminal = {
  error: {
    title: {
      failed: 'Failed',
      hostError: 'Host invocation failed',
    },
    message: {
      failedRunContractDefault:
        'There was a problem running the contract. It may be down or not running on the corresponding network',
      sorobanContractErrors: [
        'Caused by:\n    HostError: Error(Contract, #2)\n    \n    Event log (newest first):\n       0: [Diagnostic Event] contract:CDI7KTHGYGX6U76745F74WKBS7N7TUSIADWJ3L4WFXCJF2LQT63M4YJW, topics:[error, Error(Contract, #2)], data:"operation invalid on issuer"\n       1: [Diagnostic Event] topics:[fn_call, Bytes(d1f54ce6c1afea7fdfe74bfe594197dbf9d24800ec9daf962dc492e9709fb6ce), mint], data:[GAZLCLQEUDIAYAW7TV7FWHCN4YQY726DSAHKWTGZCQEXZCNFNUHDBEBQ, 100000]\n    \n    ',
        'Caused by:\n    HostError: Error(Contract, #9)\n    \n    Event log (newest first):\n       0: [Diagnostic Event] contract:CDI7KTHGYGX6U76745F74WKBS7N7TUSIADWJ3L4WFXCJF2LQT63M4YJW, topics:[error, Error(Contract, #9)], data:["not enough allowance to spend", 0, 10000000]\n       1: [Diagnostic Event] topics:[fn_call, Bytes(d1f54ce6c1afea7fdfe74bfe594197dbf9d24800ec9daf962dc492e9709fb6ce), transfer_from], data:[GCSVX4SOXK4OBLXQH2PZNGSNWTFXEABJIL4JO63DLKTAVBQZQXCBCT4D, GAZLCLQEUDIAYAW7TV7FWHCN4YQY726DSAHKWTGZCQEXZCNFNUHDBEBQ, GBT45AFONOUKIX2PAXK3NEFYHKLH7WHJZJ7ZQX37BBEDSNCA3PJ4I7PW, 10000000]\n    \n    ',
      ],
    },
  },
};

export const transactionResultCode = {
  txBadAuth:
    'There was a problem, too few valid signatures or the wrong network',
  txBadAuthExtra: 'Unused signatures attached to transaction',
  txBadSeq: 'Sequence number does not match source account',
  txFailed:
    'Check the parameters or if the issuing account has sufficient balance',
  txInsufficientBalance: 'Fee would bring account below reserve',
  txInsufficientFee: 'There was a problem, fee is too small',
  txMissingOperation: 'No operation was specified',
  txTooEarly: 'The ledger closeTime was before the minTime',
  txTooLate: 'The ledger closeTime was after the maxTime',
  txSorobanInvalid: 'Soroban-specific preconditions were not met',
};

export const txErrorCode = [
  'txBadAuth',
  'txBadAuthExtra',
  'txBadSeq',
  'txFailed',
  'txInsufficientBalance',
  'txInsufficientFee',
  'txMissingOperation',
  'txTooEarly',
  'txTooLate',
  'txSorobanInvalid',
];
