class SignerError extends Error {
  constructor(message: string) {
    super('Signer error: ' + message);
    this.name = 'SignerError';
  }
}

export default SignerError;
