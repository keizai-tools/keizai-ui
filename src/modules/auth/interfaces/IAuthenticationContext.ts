import { WalletType, type Network } from 'simple-stellar-signer-api';

import { IErrorState } from './IErrorState';
import { ILoadingState } from './ILoadingState';
import { IStatusState } from './IStatusState';

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
	errorState: IErrorState;
	loadingState: ILoadingState;
	statusState: IStatusState;
	connectWallet(network: Network): Promise<void>;
	setDisconnectWallet(): void;
	wallet: IWallet | null;
}

export interface IWallet {
	publicKey: string;
	type: WalletType | '';
}
