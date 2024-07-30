/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { Network } from 'simple-stellar-signer-api';

import FullscreenLoading from '@/common/views/FullscreenLoading';
import {
	AuthUser,
	IWallet,
	useProvideAuth,
} from '@/services/auth/hook/useAuth';

const defaultValues = {
	user: null,
	isAuthenticated: false,
	isLoading: false,
	signUp: () => Promise.resolve(),
	signIn: () => {},
	signOut: () => {},
	forgotPassword: () => Promise.resolve(),
	forgotPasswordSubmit: () => Promise.resolve(''),
	changePassword: () => Promise.resolve(''),
	connectWallet: () => Promise.resolve(),
	setDisconnectWallet: () => Promise.resolve(),
	wallet: {} as IWallet | null,
};

type AuthContextType = {
	user: AuthUser | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	signUp: ({
		email,
		password,
	}: {
		email: string;
		password: string;
	}) => Promise<void>;
	signIn: ({ email, password }: { email: string; password: string }) => void;
	signOut: () => void;
	forgotPassword: (username: string) => Promise<void>;
	forgotPasswordSubmit: ({
		code,
		newPassword,
	}: {
		code: string;
		newPassword: string;
	}) => Promise<string>;
	changePassword: ({
		oldPassword,
		newPassword,
	}: {
		oldPassword: string;
		newPassword: string;
	}) => Promise<string | undefined>;
	connectWallet: (network: Network) => Promise<void>;
	setDisconnectWallet: () => void;
	wallet: IWallet | null;
};

export const AuthContext = React.createContext<AuthContextType>(defaultValues);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const auth = useProvideAuth();

	if (auth.isLoading) {
		return <FullscreenLoading />;
	}

	return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
