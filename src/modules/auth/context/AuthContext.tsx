import { createContext, useCallback, useMemo, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
	Network,
	connectWallet as simpleSignerConnectWallet,
} from 'simple-stellar-signer-api';

import { useErrorState } from '../hooks/useErrorState';
import { useLoadingState } from '../hooks/useLoadingState';
import { useStatusState } from '../hooks/useStatusState';
import {
	IAuthenticationContext,
	IWallet,
} from '../interfaces/IAuthenticationContext';
import {
	CONFIRMATION_SENT_MESSAGE,
	SIGN_IN_SUCCESS_MESSAGE,
	SIGN_OUT_SUCCESS_MESSAGE,
	SIGN_UP_SUCCESS_MESSAGE,
	UNRECOGNIZED_TOKEN_ERROR,
} from '../message/auth-messages';
import { authService } from '../services/auth.service';

import { useToast } from '@/common/components/ui/use-toast';
import { ApiResponseError } from '@/configs/axios/errors/ApiResponseError';
import { apiService } from '@/configs/axios/services/api.service';
import { StoredCookies } from '@/modules/cookies/interfaces/cookies.enum';
import { cookieService } from '@/modules/cookies/services/cookie.service';

export const AuthContext = createContext<IAuthenticationContext | null>(null);

export function AuthProvider() {
	const { loadingState, setLoadingState } = useLoadingState();
	const { errorState, setErrorState } = useErrorState();
	const { statusState, setStatusState } = useStatusState();
	const [wallet, setWallet] = useState<IWallet | null>(null);

	const navigate = useNavigate();
	const { toast } = useToast();
	const setConnectWallet = useCallback(
		(wallet: IWallet): void => {
			localStorage.setItem('wallet', JSON.stringify(wallet));
			setWallet(wallet);
		},
		[setWallet],
	);

	const setDisconnectWallet = useCallback((): void => {
		localStorage.removeItem('wallet');
		setWallet(null);
		toast({
			title: 'Wallet disconnected',
			description: 'Wallet disconnected successfully',
		});
	}, [setWallet, toast]);

	const connectWallet = useCallback(
		async (network: Network): Promise<void> => {
			try {
				const { publicKey, wallet: type } = await simpleSignerConnectWallet(
					network,
				);

				setConnectWallet({ publicKey, type });
				toast({
					title: 'Connected wallet',
					description: 'Wallet connected successfully',
				});
			} catch (err: unknown) {
				console.error(err);

				if (err instanceof Error) {
					toast({
						title: "Couldn't connect wallet",
						description: err.message,
						variant: 'destructive',
					});
				}

				toast({
					title: 'Error connecting wallet',
					description: 'Please try again',
					variant: 'destructive',
				});
			}
		},
		[setConnectWallet, toast],
	);

	const handleSignUp = useCallback(
		async (email: string, password: string) => {
			async function signUp(email: string, password: string) {
				setLoadingState('signUp', true);
				try {
					const response = await authService.signUp(email, password);
					if (response.success && response.statusCode === 201) {
						toast({
							title: SIGN_UP_SUCCESS_MESSAGE,
							description: CONFIRMATION_SENT_MESSAGE,
						});
						setStatusState('signUp', true);
						navigate('/auth/login');
					} else {
						throw new Error('Failed to sign up');
					}
				} catch (error) {
					setStatusState('signUp', false);
					if (error instanceof ApiResponseError) {
						setErrorState('signUp', error.details.description);
						toast({
							title: `${error.error} - ${error.message}`,
							description: error.details.description,
							variant: 'destructive',
						});
					} else {
						toast({
							title: 'Error',
							description: `Unknown error when requesting creation of user: ${error}`,
							variant: 'destructive',
						});
					}
				} finally {
					setLoadingState('signUp', false);
				}
			}
			return signUp(email, password);
		},
		[navigate, setErrorState, setLoadingState, setStatusState, toast],
	);

	const handleSignIn = useCallback(
		async (email: string, password: string) => {
			async function signIn(email: string, password: string) {
				setLoadingState('signIn', true);
				setErrorState('signIn', null);
				try {
					const response = await authService.signIn(email, password);
					const { payload } = response;
					const { accessToken, refreshToken } = payload;

					const decodedToken = cookieService.decodeToken(refreshToken);
					if (!decodedToken) throw new Error(UNRECOGNIZED_TOKEN_ERROR);

					cookieService.setAccessTokenCookie(accessToken);
					cookieService.setRefreshTokenCookie(refreshToken, decodedToken.exp);
					cookieService.setEmailCookie(email, decodedToken.exp);
					apiService.setAuthentication(accessToken);
					toast({
						title: SIGN_IN_SUCCESS_MESSAGE,
						description: `Welcome back, ${email}`,
					});
					setStatusState('signIn', true);
					navigate('/');
				} catch (error) {
					setStatusState('signIn', false);
					if (error instanceof ApiResponseError) {
						setErrorState('signIn', error.details.description);
						toast({
							title: `${error.error} - ${error.message}`,
							description: error.details.description,
							variant: 'destructive',
						});
					} else {
						toast({
							title: 'Error',
							description: `Unknown error when requesting user sign in: ${error}`,
							variant: 'destructive',
						});
					}
				} finally {
					setLoadingState('signIn', false);
				}
			}
			return signIn(email, password);
		},
		[setLoadingState, toast, navigate, setStatusState, setErrorState],
	);

	const handleForgotPassword = useCallback(
		(email: string) => {
			async function forgotPassword(email: string) {
				setLoadingState('forgotPassword', true);
				setErrorState('forgotPassword', null);
				try {
					const response = await authService.forgotPassword(email);
					if (response.success && response.statusCode === 200) {
						toast({
							title: 'Password recovery',
							description: 'Password recovery email sent',
						});
						setStatusState('forgotPassword', true);
						navigate('/auth/login');
					} else {
						throw new Error('Failed to request password change');
					}
				} catch (error) {
					setStatusState('forgotPassword', false);
					if (error instanceof ApiResponseError) {
						setErrorState('forgotPassword', error.details.description);
						toast({
							title: `${error.error} - ${error.message}`,
							description: error.details.description,
							variant: 'destructive',
						});
					} else {
						toast({
							title: 'Error',
							description: `Unknown error when requesting password recovery: ${error}`,
							variant: 'destructive',
						});
					}
				} finally {
					setLoadingState('forgotPassword', false);
				}
			}
			return forgotPassword(email);
		},
		[navigate, setErrorState, setLoadingState, setStatusState, toast],
	);

	const handleRefreshSession = useCallback(() => {
		async function refreshSession() {
			setLoadingState('refreshSession', true);
			try {
				const email: string =
					cookieService.getCookie(StoredCookies.EMAIL) ?? '';
				const accessToken: string =
					cookieService.getCookie(StoredCookies.ACCESS_TOKEN) ?? '';
				const refreshToken: string =
					cookieService.getCookie(StoredCookies.REFRESH_TOKEN) ?? '';

				if (!email || !refreshToken) {
					setLoadingState('refreshSession', false);
					setStatusState('refreshSession', false);
					return;
				}

				if (!accessToken && (email || refreshToken)) {
					const { payload } = await authService.refreshToken(
						email,
						refreshToken,
					);
					cookieService.setAccessTokenCookie(accessToken);
					apiService.setAuthentication(payload.accessToken);
					setLoadingState('refreshSession', false);
					setStatusState('refreshSession', true);
					return;
				}

				setLoadingState('refreshSession', false);
				setStatusState('refreshSession', true);
			} catch (error) {
				setLoadingState('refreshSession', false);
				setStatusState('refreshSession', false);

				if (error instanceof ApiResponseError) {
					setErrorState('refreshSession', error.details.description);

					if (error.details.description !== 'Invalid refresh token') {
						toast({
							title: `${error.error} - ${error.message}`,
							description: error.details.description,
							variant: 'destructive',
						});
					}
				} else {
					toast({
						title: 'Error',
						description: `Unknown error when refreshing session: ${error}`,
						variant: 'destructive',
					});
				}

				navigate('auth/login');
			}
		}
		return refreshSession();
	}, [setLoadingState, setStatusState, navigate, setErrorState, toast]);

	const handleSignOut = useCallback(() => {
		setLoadingState('signOut', true);
		try {
			cookieService.removeAll();
			apiService.setAuthentication('');
			setDisconnectWallet();
			toast({
				title: 'Sign out',
				description: SIGN_OUT_SUCCESS_MESSAGE,
			});
			setStatusState('signOut', true);
			navigate('/auth/login');
		} catch (error) {
			setStatusState('signOut', false);
			toast({
				title: 'Error',
				description: `Unknown error when signing out: ${error}`,
				variant: 'destructive',
			});
		}
	}, [navigate, setDisconnectWallet, setLoadingState, setStatusState, toast]);

	const handleResetPassword = useCallback(
		async (email: string, password: string, code: string) => {
			async function resetPassword(
				email: string,
				password: string,
				code: string,
			) {
				setLoadingState('resetPassword', true);
				setErrorState('resetPassword', null);
				try {
					const response = await authService.resetPassword(
						email,
						password,
						code,
					);
					if (response.success && response.statusCode === 200) {
						toast({
							title: 'Password reset',
							description: 'Password reset successful',
						});
						setStatusState('resetPassword', true);
						navigate('/auth/login');
					} else {
						throw new Error('Failed to reset password');
					}
				} catch (error) {
					setStatusState('resetPassword', false);
					if (error instanceof ApiResponseError) {
						setErrorState('resetPassword', error.details.description);
						toast({
							title: `${error.error} - ${error.message}`,
							description: error.details.description,
							variant: 'destructive',
						});
					} else {
						toast({
							title: 'Error',
							description: `Unknown error when resetting password: ${error}`,
							variant: 'destructive',
						});
					}
				} finally {
					setLoadingState('resetPassword', false);
				}
			}
			return resetPassword(email, password, code);
		},
		[navigate, setErrorState, setLoadingState, setStatusState, toast],
	);

	const contextValue = useMemo(
		() => ({
			handleRefreshSession,
			handleForgotPassword,
			handleResetPassword,
			setDisconnectWallet,
			handleSignOut,
			connectWallet,
			handleSignUp,
			handleSignIn,
			loadingState,
			statusState,
			errorState,
			wallet,
		}),
		[
			handleRefreshSession,
			handleForgotPassword,
			handleResetPassword,
			setDisconnectWallet,
			handleSignOut,
			connectWallet,
			handleSignUp,
			handleSignIn,
			loadingState,
			statusState,
			errorState,
			wallet,
		],
	);

	return (
		<AuthContext.Provider value={contextValue}>
			<Outlet />
		</AuthContext.Provider>
	);
}
