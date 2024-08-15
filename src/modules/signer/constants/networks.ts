import { NETWORK } from '@/common/types/soroban.enum';

const NETWORKS: Partial<Record<NETWORK, string>> = {
	[NETWORK.SOROBAN_TESTNET]:
		import.meta.env.VITE_SIMPLE_SIGNER_API_TESTNET ??
		'https://sign-testnet.bigger.systems',
	[NETWORK.SOROBAN_MAINNET]:
		import.meta.env.VITE_SIMPLE_SIGNER_API_MAINNET ??
		'https://sign.bigger.systems',
	[NETWORK.SOROBAN_FUTURENET]:
		import.meta.env.VITE_SIMPLE_SIGNER_API_FUTURENET ??
		'https://sign-futurenet.bigger.systems',
};

export default NETWORKS;
