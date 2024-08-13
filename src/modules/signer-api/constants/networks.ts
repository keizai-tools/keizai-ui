import { NETWORK } from '@/common/types/soroban.enum';

const NETWORKS: Partial<Record<NETWORK, string>> = {
	[NETWORK.SOROBAN_TESTNET]:
		import.meta.env.VITE_SOROBAN_API_TESTNET_URL ??
		'https://sign-testnet.bigger.systems',
	[NETWORK.SOROBAN_MAINNET]:
		import.meta.env.VITE_SOROBAN_API_MAINNET_URL ??
		'https://sign.bigger.systems',
	[NETWORK.SOROBAN_FUTURENET]:
		import.meta.env.VITE_SOROBAN_API_FUTURENET_URL ??
		'https://sign-futurenet.bigger.systems',
};

export default NETWORKS;
