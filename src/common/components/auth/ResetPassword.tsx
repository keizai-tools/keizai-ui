import { useMutation } from '@tanstack/react-query';
import { ChevronRightSquare } from 'lucide-react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import PasswordInput from '../Input/PasswordInput';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';

import { CognitoError } from '@/services/auth/error/cognitoError';
import { useAuth } from '@/services/auth/hook/useAuth';
import { exceptionsCognitoErrors } from '@/services/auth/validators/exceptionsCognitoErrors';

export interface IPasswordReset {
	code: string;
	newPassword: string;
	confirmPassword: string;
}

function ResetPassword() {
	const { toast } = useToast();
	const navigate = useNavigate();
	const [error, setError] = React.useState('');
	const [loading, setLoading] = React.useState(false);
	const {
		control,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			code: '',
			newPassword: '',
			confirmPassword: '',
		},
	});
	const { forgotPasswordSubmit } = useAuth();
	const { mutate, isPending, isError } = useMutation({
		mutationFn: forgotPasswordSubmit,
		onSuccess: () => {
			toast({
				title: 'Password changed',
				description: 'You can now log in with your new password',
			});
			setLoading(false);
			setTimeout(() => {
				navigate('login');
			}, 3000);
		},
		onError: (error: CognitoError) => {
			const errorMessage = exceptionsCognitoErrors(error as CognitoError);
			if (errorMessage) {
				setError(errorMessage);
			}
			setLoading(false);
		},
	});

	const onSubmit = async (values: IPasswordReset) => {
		setLoading(true);
		const { code, newPassword } = values;
		await mutate({ code, newPassword });
	};

	return (
		<form
			className="md:w-1/2"
			onSubmit={handleSubmit(onSubmit)}
			data-test="forgot-password-form-container"
		>
			<h1
				className="text-primary font-bold text-4xl mb-7"
				data-test="forgot-password-title"
			>
				Password Reset
			</h1>
			<div className="flex flex-col mb-4">
				<div className="flex items-center border-2 px-3 rounded-md bg-white">
					<ChevronRightSquare className="h-5 w-5 text-gray-400" />
					<Controller
						control={control}
						name="code"
						rules={{ required: 'Code is required' }}
						render={({ field }) => (
							<Input
								className="pl-2 border-none bg-white focus-visible:ring-0 text-black"
								type="text"
								placeholder="Code"
								data-test="forgot-password-code"
								{...field}
							/>
						)}
					/>
				</div>
				{errors.code && (
					<span className="text-sm text-red-500 mt-1">
						{errors.code.message}
					</span>
				)}
			</div>
			<div className="flex flex-col mb-4">
				<Controller
					control={control}
					name="newPassword"
					rules={{
						required: 'Password is required',
						pattern: {
							value:
								/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,255}$/,
							message:
								'The password must consist of at least 8 alphanumeric characters and alternate between uppercase, lowercase, and special characters',
						},
					}}
					render={({ field }) => (
						<PasswordInput
							value={field.value}
							onChange={field.onChange}
							placeholder="New Password"
						/>
					)}
				/>
				{errors.newPassword && (
					<p className="ml-4">
						<span
							className="text-sm text-red-500 mt-1"
							data-test="forgot-password-error-message"
						>
							{errors.newPassword.message}
						</span>
					</p>
				)}
			</div>
			<div className="flex flex-col mb-4">
				<Controller
					control={control}
					name="confirmPassword"
					rules={{
						required: 'Confirm password is required',
						validate: (value) => {
							return value === watch('newPassword') || 'Passwords do not match';
						},
					}}
					render={({ field }) => (
						<PasswordInput
							value={field.value}
							onChange={field.onChange}
							placeholder="Confirm New Password"
						/>
					)}
				/>
				{errors.confirmPassword && (
					<p
						className="text-sm text-red-500 mt-1 pl-4"
						data-test="confirm-password-reset-error"
					>
						{errors.confirmPassword.message}
					</p>
				)}
				{isError && !loading && error && (
					<span className="text-sm text-red-500 mt-2 pl-4">{error}</span>
				)}
			</div>
			<Button
				type="submit"
				className="block w-full bg-primary dark:bg-primary mt-4 py-2 rounded-md text-black font-semibold mb-2"
				data-test="forgot-password-btn-submit"
				disabled={isPending}
			>
				Login
			</Button>
			<span
				className="text-sm ml-2 text-white cursor-pointer"
				data-test="forgot-password-footer-info"
			>
				Already have an account?{' '}
				<Link
					to="/login"
					className="text-primary"
					data-test="forgot-password-footer-link"
				>
					Log In
				</Link>
			</span>
		</form>
	);
}

export default ResetPassword;
