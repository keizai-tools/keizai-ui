import { IStatusState, IStatus } from './IStatusState';

import { NETWORK, BACKEND_NETWORK } from '@/common/types/soroban.enum';
import { WalletType } from '@/modules/signer/constants/enums';

export interface IAuthenticationContext {
	handleResetPassword: (
		email: string,
		newPassword: string,
		code: string,
	) => Promise<void>;
	handleSignIn: (email: string, password: string) => Promise<void>;
	handleSignUp: (email: string, password: string) => Promise<void>;
	handleForgotPassword: (email: string) => Promise<void>;
	handleRefreshSession: () => Promise<void>;
	handleSignOut: () => void;
	statusState: IStatusState;
	connectWallet(network: Partial<NETWORK>): Promise<void>;
	disconnectWallet(network?: Partial<NETWORK>): void;
	onCreateAccount(
		showToast?: boolean,
		refreshSession?: boolean,
		wallets?: IWallet,
		email?: string,
	): void;
	handleChangePassword: (
		oldPassword: string,
		newPassword: string,
	) => Promise<void>;
	wallet: IWallet;
	setStatusState: (
		statusType: keyof IStatusState,
		value: Partial<IStatus>,
	) => void;
}

export interface IWallet {
	[BACKEND_NETWORK.SOROBAN_MAINNET]: IWalletContent | null;
	[BACKEND_NETWORK.SOROBAN_TESTNET]: IWalletContent | null;
	[BACKEND_NETWORK.SOROBAN_FUTURENET]: IWalletContent | null;
	[BACKEND_NETWORK.AUTO_DETECT]: null;
}

export interface IWalletContent {
	type: WalletType | '';
	network: NETWORK;
	privateKey?: string;
	autoGenerated?: boolean;
	publicKey: string;
	email: string | null;
}
