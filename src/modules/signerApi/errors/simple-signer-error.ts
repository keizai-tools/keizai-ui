class SimpleSignerError extends Error {
	constructor(message: string) {
		super('SimpleSigner error: ' + message);
		this.name = 'SimpleSignerError';
	}
}

export default SimpleSignerError;
