import type { IErrorState } from './IErrorState';
import { ILoadingState } from './ILoadingState';
import type { IStatusState } from './IStatusState';

export interface IAuthenticationContext {
	// handleConfirmUser: (username: string, code: string) => Promise<void>;
	// handleResendConfirmationCode: (username: string) => Promise<void>;

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
}
