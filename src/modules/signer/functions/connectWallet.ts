import { WalletType } from '../constants/enums';
import SignerError from '../errors/signerError';
import getUrl from '../helpers/getUrl';
import messageHandler from '../helpers/messageHandler';
import { IConnectMessage } from '../types';

import { NETWORK } from '@/common/types/soroban.enum';

export default async function signerConnectWallet(
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
  } catch (error: unknown) {
    if (typeof error === 'string') {
      throw new SignerError(error);
    }

    throw error;
  }
}
