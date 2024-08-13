import { WalletType } from '../constants/enums';
import SimpleSignerError from '../errors/simple-signer-error';
import getUrl from '../helpers/get-url';
import messageHandler from '../helpers/message-handler';
import { IConnectMessage } from '../types';

import { NETWORK } from '@/common/types/soroban.enum';

export default async function simpleSignerConnectWallet(
	network: NETWORK,
	wallets?: WalletType[],
): Promise<IConnectMessage | null> {
	try {
		const origin = getUrl(network);
		if (!origin) return null;
		const url = `${origin}/connect`;

		const {
			message: { publicKey, wallet },
		} = await messageHandler<IConnectMessage>({
			url,
			origin,
			wallets: wallets || [],
		});

		return {
			publicKey,
			wallet,
		};
	} catch (err: unknown) {
		if (typeof err === 'string') {
			throw new SimpleSignerError(err);
		}

		throw err;
	}
}
