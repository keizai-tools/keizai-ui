import SignerError from '../errors/signerError';
import getUrl from '../helpers/getUrl';
import messageHandler from '../helpers/messageHandler';
import { IOperationGroup, ISignMessage } from '../types';

import { NETWORK } from '@/common/types/soroban.enum';

export default async function signTransaction(
	transactionXDR: string,
	network: NETWORK,
	extraConfig?: {
		description?: string;
		operationGroups?: IOperationGroup[];
	},
): Promise<string | null> {
	try {
		const origin = getUrl(network);
		if (!origin) return null;
		const url = `${origin}/sign`;

		const {
			message: { signedXDR },
		} = await messageHandler<ISignMessage>({
			url,
			origin,
			xdr: transactionXDR,
			...extraConfig,
		});

		return signedXDR;
	} catch (err: unknown) {
		if (typeof err === 'string') {
			throw new SignerError(err);
		}

		throw err;
	}
}
