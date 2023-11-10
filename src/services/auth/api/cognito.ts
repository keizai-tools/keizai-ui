import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React from 'react';
import { redirect, useNavigate } from 'react-router-dom';

import { User } from '../domain/user';
import { CognitoError, BadRequestException } from '../error/cognitoError';
import { useAuth } from '../hook/useAuth';
import { AUTH_RESPONSE } from '../validators/auth-response.enum';
import { exceptionsCognitoErrors } from '../validators/exceptions-cognito';

import { useToast } from '@/common/components/ui/use-toast';

export const useLoginCognitoMutation = () => {
	const { toast } = useToast();
	const [error, setError] = React.useState<string>('');
	const [isPending, setIsPending] = React.useState<boolean>(false);
	const { signIn } = useAuth();

	const onLoginSubmit = async (values: User) => {
		try {
			setIsPending(true);
			await signIn(values);
			setError('');
			redirect('/');
		} catch (error) {
			const errorMessage = exceptionsCognitoErrors(error as CognitoError);
			if (errorMessage instanceof BadRequestException) {
				setError(errorMessage.message);
			} else {
				toast({
					title: 'Something when wrong!',
					description: errorMessage.message,
					variant: 'destructive',
				});
			}
			setIsPending(false);
		}
	};

	return { error, isPending, onLoginSubmit };
};

export const useCreateAccountMutation = () => {
	const { toast } = useToast();
	const { signUp } = useAuth();
	const [error, setError] = React.useState<string>('');

	const mutation = useMutation({
		mutationFn: signUp,
		onSuccess: () => {
			toast({
				title: 'Account created',
				description: 'Please verify your email',
			});
			setError('');
		},
		onError: (error: AxiosError<Error>) => {
			if (error.response) {
				const errorMessage = exceptionsCognitoErrors(
					error.response.data as CognitoError,
				);
				if (errorMessage instanceof BadRequestException) {
					setError(errorMessage.message);
				} else {
					toast({
						title: 'Something when wrong!',
						description: errorMessage.message,
						variant: 'destructive',
					});
				}
			}
		},
	});

	return { mutation, error };
};

export const useRecoverPasswordMutation = () => {
	const { forgotPassword } = useAuth();
	const { toast } = useToast();
	const navigate = useNavigate();

	const mutation = useMutation({
		mutationFn: forgotPassword,
		onSuccess: () => {
			navigate('/auth/reset-password');
		},
		onError: (error) => {
			toast({
				title: 'Failed to send code',
				description: error.message,
				variant: 'destructive',
			});
		},
	});

	return mutation;
};

export const useResetPasswordMutation = () => {
	const { toast } = useToast();
	const navigate = useNavigate();
	const [error, setError] = React.useState('');
	const [loading, setLoading] = React.useState(false);

	const { forgotPasswordSubmit } = useAuth();
	const mutation = useMutation({
		mutationFn: forgotPasswordSubmit,
		onSuccess: () => {
			toast({
				title: 'Password changed',
				description: 'You can now log in with your new password',
			});
			setLoading(false);
			setTimeout(() => {
				navigate('/auth/login');
			}, 3000);
		},
		onError: (error: CognitoError) => {
			const errorMessage = exceptionsCognitoErrors(error as CognitoError);
			if (errorMessage instanceof BadRequestException) {
				setError(errorMessage.message);
			} else {
				toast({
					title: 'Something when wrong!',
					description: errorMessage.message,
					variant: 'destructive',
				});
			}
			setLoading(false);
		},
	});

	return { mutation, error, loading, setLoading };
};

export const useChangePasswordMutation = () => {
	const { changePassword } = useAuth();
	const navigate = useNavigate();
	const { toast } = useToast();
	const [error, setError] = React.useState('');

	const mutation = useMutation({
		mutationFn: changePassword,
		onSuccess: () => {
			navigate('/');
			toast({
				title: 'Successful!',
				description: AUTH_RESPONSE.PASSWORD_CHANGED,
			});
		},
		onError: (error: CognitoError) => {
			const errorMessage = exceptionsCognitoErrors(error as CognitoError);
			if (errorMessage instanceof BadRequestException) {
				setError(errorMessage.message);
			} else {
				toast({
					title: 'Something when wrong!',
					description: errorMessage.message,
					variant: 'destructive',
				});
			}
		},
	});

	return { mutation, error };
};
