import { createContext, useCallback, useMemo, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
	Network,
	connectWallet as simpleSignerConnectWallet,
} from 'simple-stellar-signer-api';

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
				setStatusState('signUp', {
					loading: true,
				});
				try {
					const response = await authService.signUp(email, password);
					if (response.success && response.statusCode === 201) {
						toast({
							title: SIGN_UP_SUCCESS_MESSAGE,
							description: CONFIRMATION_SENT_MESSAGE,
						});
						setStatusState('signUp', {
							status: true,
							error: null,
							loading: false,
						});
						navigate('/auth/login');
					} else {
						throw new Error('Failed to sign up');
					}
				} catch (error) {
					setStatusState('signUp', {
						status: false,
						error: null,
						loading: false,
					});
					if (error instanceof ApiResponseError) {
						setStatusState('signUp', { error: error.details.description });
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
					setStatusState('signUp', {
						loading: false,
					});
				}
			}
			return signUp(email, password);
		},
		[navigate, setStatusState, toast],
	);

	const handleSignIn = useCallback(
		async (email: string, password: string) => {
			async function signIn(email: string, password: string) {
				setStatusState('signIn', {
					loading: true,
					error: null,
				});
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
					setStatusState('signIn', { status: true });
					navigate('/');
				} catch (error) {
					setStatusState('signIn', { status: false });
					if (error instanceof ApiResponseError) {
						setStatusState('signIn', { error: error.details.description });
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
					setStatusState('signIn', {
						loading: false,
					});
				}
			}
			return signIn(email, password);
		},
		[setStatusState, toast, navigate],
	);

	const handleForgotPassword = useCallback(
		(email: string) => {
			async function forgotPassword(email: string) {
				setStatusState('forgotPassword', {
					loading: true,
					error: null,
				});
				try {
					const response = await authService.forgotPassword(email);
					if (response.success && response.statusCode === 200) {
						toast({
							title: 'Password recovery',
							description: 'Password recovery email sent',
						});
						setStatusState('forgotPassword', {
							status: true,
							loading: false,
						});
						navigate('/auth/login');
					} else {
						throw new Error('Failed to request password change');
					}
				} catch (error) {
					setStatusState('forgotPassword', {
						status: false,
						loading: false,
					});
					if (error instanceof ApiResponseError) {
						setStatusState('forgotPassword', {
							error: error.details.description,
						});
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
					setStatusState('forgotPassword', {
						loading: false,
					});
				}
			}
			return forgotPassword(email);
		},
		[navigate, setStatusState, toast],
	);

	const handleRefreshSession = useCallback(() => {
		async function refreshSession() {
			setStatusState('refreshSession', { loading: true });
			try {
				const email: string =
					cookieService.getCookie(StoredCookies.EMAIL) ?? '';
				const accessToken: string =
					cookieService.getCookie(StoredCookies.ACCESS_TOKEN) ?? '';
				const refreshToken: string =
					cookieService.getCookie(StoredCookies.REFRESH_TOKEN) ?? '';

				if (!email || !refreshToken) {
					setStatusState('refreshSession', {
						status: false,
						loading: false,
					});
					return;
				}

				if (!accessToken && (email || refreshToken)) {
					const { payload } = await authService.refreshToken(
						email,
						refreshToken,
					);
					cookieService.setAccessTokenCookie(accessToken);
					apiService.setAuthentication(payload.accessToken);
					setStatusState('refreshSession', {
						status: true,
						loading: false,
					});
					return;
				}

				setStatusState('refreshSession', {
					status: true,
					loading: false,
				});
			} catch (error) {
				setStatusState('refreshSession', {
					status: false,
					loading: false,
				});

				if (error instanceof ApiResponseError) {
					setStatusState('refreshSession', {
						error: error.details.description,
					});

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
	}, [setStatusState, navigate, toast]);

	const handleSignOut = useCallback(() => {
		setStatusState('signOut', {
			loading: true,
		});
		try {
			cookieService.removeAll();
			apiService.setAuthentication('');
			toast({
				title: 'Sign out',
				description: SIGN_OUT_SUCCESS_MESSAGE,
			});
			setStatusState('signOut', {
				status: true,
				loading: false,
			});
			navigate('/auth/login');
		} catch (error) {
			setStatusState('signOut', {
				status: false,
				loading: false,
			});
			toast({
				title: 'Error',
				description: `Unknown error when signing out: ${error}`,
				variant: 'destructive',
			});
		}
	}, [navigate, setStatusState, toast]);

	const handleResetPassword = useCallback(
		async (email: string, password: string, code: string) => {
			async function resetPassword(
				email: string,
				password: string,
				code: string,
			) {
				setStatusState('resetPassword', {
					loading: true,
					error: null,
				});
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
						setStatusState('resetPassword', {
							status: true,
							loading: false,
						});
						navigate('/auth/login');
					} else {
						throw new Error('Failed to reset password');
					}
				} catch (error) {
					setStatusState('resetPassword', {
						status: false,
						loading: false,
					});
					if (error instanceof ApiResponseError) {
						setStatusState('resetPassword', {
							error: error.details.description,
						});
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
					setStatusState('resetPassword', {
						loading: false,
					});
				}
			}
			return resetPassword(email, password, code);
		},
		[navigate, setStatusState, toast],
	);

	const handleChangePassword = useCallback(
		async (oldPassword: string, newPassword: string) => {
			setStatusState('changePassword', {
				loading: true,
				error: null,
			});
			try {
				const email = cookieService.getCookie(StoredCookies.EMAIL);
				if (!email) throw new Error('No email found');
				const response = await authService.changePassword(
					email,
					oldPassword,
					newPassword,
				);
				if (response.success && response.statusCode === 200) {
					toast({
						title: 'Password changed',
						description: 'Password changed successfully',
					});
					setStatusState('changePassword', {
						status: true,
						loading: false,
					});
					navigate('/auth/login');
				} else {
					throw new Error('Failed to change password');
				}
			} catch (error) {
				setStatusState('changePassword', {
					status: false,
					loading: false,
				});
				if (error instanceof ApiResponseError) {
					setStatusState('changePassword', {
						error: error.details.description,
					});
					toast({
						title: `${error.error} - ${error.message}`,
						description: error.details.description,
						variant: 'destructive',
					});
				} else {
					toast({
						title: 'Error',
						description: `Unknown error when changing password: ${error}`,
						variant: 'destructive',
					});
				}
			} finally {
				setStatusState('changePassword', {
					loading: false,
				});
			}
		},
		[navigate, setStatusState, toast],
	);

	const contextValue = useMemo(
		() => ({
			handleRefreshSession,
			handleChangePassword,
			handleForgotPassword,
			handleResetPassword,
			setDisconnectWallet,
			handleSignOut,
			connectWallet,
			handleSignUp,
			handleSignIn,
			statusState,
			wallet,
		}),
		[
			handleRefreshSession,
			handleChangePassword,
			handleForgotPassword,
			handleResetPassword,
			setDisconnectWallet,
			handleSignOut,
			connectWallet,
			handleSignUp,
			handleSignIn,
			statusState,
			wallet,
		],
	);

	return (
		<AuthContext.Provider value={contextValue}>
			<Outlet />
		</AuthContext.Provider>
	);
}
