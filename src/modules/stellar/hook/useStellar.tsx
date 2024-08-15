import { Keypair } from 'stellar-sdk';

import { IKeypair } from '../domain/keypair';
import { STELLAR_RESPONSE } from '../validators/stellarExceptions';

import { FRIENDBOT, NETWORK } from '@/common/types/soroban.enum';

function useStellar() {
	async function connectAccount(secretKey: string): Promise<IKeypair> {
		try {
			const keyPair = Keypair.fromSecret(secretKey);
			return {
				publicKey: keyPair.publicKey(),
				secretKey,
			};
		} catch (error) {
			throw new Error(STELLAR_RESPONSE.INVALID_PRIVATE_KEY);
		}
	}

	function createNewAccount(): IKeypair {
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
	}

	function fundingAccount(network: string, publicKey: string) {
		switch (network) {
			case NETWORK.SOROBAN_FUTURENET:
				fetch(`${FRIENDBOT.FUTURENET}${publicKey}`);
				break;
			case NETWORK.SOROBAN_TESTNET:
				fetch(`${FRIENDBOT.TESTNET}${publicKey}`);
				break;
		}
	}

	return { connectAccount, createNewAccount, fundingAccount };
}

export default useStellar;
