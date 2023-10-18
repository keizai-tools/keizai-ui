/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';

import { AuthUser, useProvideAuth } from '@/services/auth/hook/useAuth';

const defaultValues = {
	user: null,
	isAuthenticated: false,
	isLoading: false,
	signUp: () => Promise.resolve(),
	signIn: () => {},
	signOut: () => {},
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
};

export const AuthContext = React.createContext<AuthContextType>(defaultValues);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const auth = useProvideAuth();
	return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
