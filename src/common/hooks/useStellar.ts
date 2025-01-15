import { Keypair } from 'stellar-sdk';

import { IKeypair } from '../../modules/stellar/domain/keypair';
import { STELLAR_RESPONSE } from '../../modules/stellar/validators/stellarExceptions';

import { useEphemeralFriendBotMutation } from '@/common/api/ephemeral';
import { FRIENDBOT, NETWORK } from '@/common/types/soroban.enum';

function useStellar() {
  const { mutateAsync: friendBotMutate } = useEphemeralFriendBotMutation();

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

  async function fundingAccount({
    network,
    publicKey,
    urlEphemeral,
  }: {
    publicKey: string;
    network?: NETWORK;
    urlEphemeral?: string;
  }): Promise<boolean> {
    const networkUrls = {
      [NETWORK.SOROBAN_FUTURENET]: `${FRIENDBOT.FUTURENET}${publicKey}`,
      [NETWORK.SOROBAN_TESTNET]: `${FRIENDBOT.TESTNET}${publicKey}`,
    };

    async function fetchWithRetry(url: string) {
      let response;
      do {
        try {
          response = await fetch(url);
        } catch (error) {
          console.error('Fetch failed, retrying in 10 seconds...', error);
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      } while (!response?.ok);
    }

    if (urlEphemeral) {
      await friendBotMutate({ publicKey });
    } else {
      const url = networkUrls[network as keyof typeof networkUrls];
      await fetchWithRetry(url);
    }
    return true;
  }

  return {
    connectAccount,
    createNewAccount,
    fundingAccount,
  };
}

export default useStellar;
