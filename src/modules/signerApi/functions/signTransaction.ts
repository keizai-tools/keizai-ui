import SimpleSignerError from '../errors/simple-signer-error';
import getUrl from '../helpers/get-url';
import messageHandler from '../helpers/message-handler';
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
			throw new SimpleSignerError(err);
		}

		throw err;
	}
}
