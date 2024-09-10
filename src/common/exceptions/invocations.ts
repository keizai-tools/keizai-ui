export enum INVOCATION_RESPONSE {
  ERROR_RUN_INVOCATION = 'There was a problem running the invocation',
  FAILED_RUN_CONTRACT = 'There was a problem running the contract. It may be down or not running on the corresponding network',
  ERROR_DEFAULT = 'There was an unexpected error',
}

export enum STATUS {
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

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
