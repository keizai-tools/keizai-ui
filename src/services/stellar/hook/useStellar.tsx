import { Keypair } from 'soroban-client';

import { IKeypair } from '../domain/keypair';
import { STELLAR_RESPONSE } from '../validators/stellarExceptions';

function useStellar() {
	const connectAccount = async (secretKey: string): Promise<IKeypair> => {
		try {
			const keyPair = Keypair.fromSecret(secretKey);
			return {
				publicKey: keyPair.publicKey(),
				secretKey,
			};
		} catch (error) {
			throw new Error(STELLAR_RESPONSE.INVALID_PRIVATE_KEY);
		}
	};

	const createNewAccount = (): IKeypair => {
		try {
			const randomPair = Keypair.random();
			const secretKey: string = randomPair.secret();
			const publicKey: string = randomPair.publicKey();
			return {
				publicKey,
				secretKey,
			};
		} catch (error) {
			throw new Error(STELLAR_RESPONSE.FAILED_CRETATE_ACCOUNT);
		}
	};

	return { connectAccount, createNewAccount };
}

export default useStellar;
