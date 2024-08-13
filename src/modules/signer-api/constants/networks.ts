import { NETWORK } from '@/common/types/soroban.enum';

const NETWORKS: Partial<Record<NETWORK, string>> = {
	[NETWORK.SOROBAN_TESTNET]: 'https://sign-testnet.bigger.systems',
	[NETWORK.SOROBAN_MAINNET]: 'https://sign.bigger.systems',
	[NETWORK.SOROBAN_FUTURENET]: 'https://sign-futurenet.bigger.systems',
};

export default NETWORKS;
