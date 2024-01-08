export enum INVOCATION_RESPONSE {
	ERROR_RUN_INVOCATION = 'There was a problem running the invocation',
	FAILED_RUN_CONTRACT = 'There was a problem running the contract. It may be down or not running on the corresponding network',
	ERROR_DEFAULT = 'There was an unexpected error',
}

export enum STATUS {
	FAILED = 'FAILED',
	SUCCESS = 'SUCCESS',
}
