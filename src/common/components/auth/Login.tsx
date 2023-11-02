import { User2, Loader2 } from 'lucide-react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, redirect } from 'react-router-dom';

import PasswordInput from '../Input/PasswordInput';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

import { User } from '@/services/auth/domain/user';
import { CognitoError } from '@/services/auth/error/cognitoError';
import { useAuth } from '@/services/auth/hook/useAuth';
import { AUTH_VALIDATIONS } from '@/services/auth/validators/authResponse';
import { exceptionsCognitoErrors } from '@/services/auth/validators/exceptionsCognitoErrors';

function Login() {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			email: '',
			password: '',
		},
	});
	const [error, setError] = React.useState('');
	const [isPending, setIsPending] = React.useState(false);
	const { signIn } = useAuth();

	const onSubmit = async (values: User) => {
		try {
			setIsPending(true);
			await signIn(values);
			redirect('/');
		} catch (error) {
			const errorMessage = exceptionsCognitoErrors(error as CognitoError);
			if (errorMessage) {
				setError(errorMessage);
			}
			setIsPending(false);
		}
	};

	return (
		<form
			className="md:w-1/2"
			data-test="login-form-container"
			onSubmit={handleSubmit(onSubmit)}
		>
			<h1
				className="text-primary font-bold text-4xl mb-7"
				data-test="login-form-title"
			>
				Welcome Back
			</h1>
			<div className="flex flex-col mb-4">
				<div className="flex items-center border-2 px-3 rounded-md bg-white">
					<User2 className="h-5 w-5 text-gray-400" />
					<Controller
						control={control}
						name="email"
						rules={{ required: AUTH_VALIDATIONS.EMAIL_REQUIRED }}
						render={({ field }) => (
							<Input
								className="pl-2 border-none bg-white focus-visible:ring-0 text-black"
								type="text"
								placeholder="Email"
								data-test="login-form-email"
								{...field}
							/>
						)}
					/>
				</div>
				{errors.email && <p className="text-red-500">{errors.email.message}</p>}
			</div>
			<div className="flex flex-col mb-4">
				<Controller
					control={control}
					name="password"
					rules={{ required: AUTH_VALIDATIONS.PASSWORD_REQUIRED }}
					render={({ field }) => (
						<PasswordInput value={field.value} onChange={field.onChange} />
					)}
				/>
				{errors.password && (
					<p className="text-red-500">{errors.password.message}</p>
				)}
			</div>
			{!errors.password && !errors.email && error && (
				<p className="text-red-500 ml-4" data-test="login-form-error-message">
					{error}
				</p>
			)}
			<Button
				type="submit"
				className="w-full bg-primary dark:bg-primary mt-4 py-2 rounded-md text-black font-semibold mb-2"
				data-test="login-form-btn-submit"
				disabled={isPending}
			>
				{isPending ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin text-black" />
					</>
				) : (
					'Login'
				)}
			</Button>
			<span
				className="flex justify-center w-full text-center text-sm ml-2 text-white cursor-pointer"
				data-test="login-form-footer-info"
			>
				Don't have an account?{' '}
				<Link
					to="/register"
					className="text-primary ml-2"
					data-test="login-form-footer-register-link"
				>
					Join now
				</Link>
			</span>
			<p className="text-sm mt-2 cursor-pointer text-center">
				<Link
					to="/forgot-password"
					className="text-primary "
					data-test="login-form-footer-password-link"
				>
					Forgot your password?
				</Link>
			</p>
		</form>
	);
}

export default Login;
