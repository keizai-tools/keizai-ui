import { Loader2, AtSign } from 'lucide-react';
import { Fragment } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import AlertError from '@/common/components/Form/AlertError';
import ErrorMessage from '@/common/components/Form/ErrorMessage';
import PasswordInput from '@/common/components/Input/PasswordInput';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { useAuthProvider } from '@/modules/auth/hooks/useAuthProvider';
import { AUTH_VALIDATIONS } from '@/modules/auth/message/auth-messages';

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
	const { handleSignIn, statusState, setStatusState } = useAuthProvider();

	async function onSubmit(values: { email: string; password: string }) {
		await handleSignIn(values.email, values.password);
	}
	const navigate = useNavigate();

	function handleSignUpClick() {
		setStatusState('signUp', {
			error: null,
		});
		navigate('/auth/register');
	}

	function handleForgotPasswordClick() {
		setStatusState('forgotPassword', {
			error: null,
		});
		navigate('/auth/forgot-password');
	}

	return (
		<form
			className="w-full max-w-[500px] px-2 flex flex-col gap-1"
			data-test="login-form-container"
			onSubmit={handleSubmit(onSubmit)}
		>
			<h1
				className="text-4xl font-bold text-primary mb-7"
				data-test="login-form-title"
			>
				Welcome Back
			</h1>
			<div className="flex flex-col mb-4">
				<div className="flex items-center px-3 bg-white border-2 rounded-md">
					<AtSign className="w-5 h-5 text-gray-400" />
					<Controller
						control={control}
						name="email"
						rules={{
							required: AUTH_VALIDATIONS.EMAIL_REQUIRED,
							pattern: {
								value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
								message: AUTH_VALIDATIONS.EMAIL_INVALID,
							},
						}}
						render={({ field }) => (
							<Input
								className="pl-2 text-black bg-white border-none focus-visible:ring-0"
								type="text"
								placeholder="Email"
								data-test="login-form-email"
								{...field}
							/>
						)}
					/>
				</div>
				{errors.email && (
					<ErrorMessage
						message={errors.email.message as string}
						testName="login-form-email-error-message"
						styles="text-sm"
					/>
				)}
			</div>
			<div className="flex flex-col">
				<Controller
					control={control}
					name="password"
					rules={{
						required: AUTH_VALIDATIONS.PASSWORD_REQUIRED,
						pattern: {
							value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)/,
							message: AUTH_VALIDATIONS.PASSWORD_INVALID,
						},
					}}
					render={({ field }) => (
						<PasswordInput value={field.value} onChange={field.onChange} />
					)}
				/>
				{errors.password && (
					<ErrorMessage
						message={errors.password.message as string}
						testName="login-form-password-error-message"
						styles="text-sm"
						type="password"
					/>
				)}
			</div>
			{!errors.email &&
				!errors.password &&
				(statusState.signIn.error || statusState.signIn.error?.length) && (
					<AlertError
						title="Login failed"
						message={
							Array.isArray(statusState.signIn.error)
								? statusState.signIn.error.join(', ')
								: statusState.signIn.error
						}
						testName="login-form-error-message"
					/>
				)}
			<Button
				type="submit"
				className="w-full py-2 mt-8 mb-2 font-semibold text-black rounded-md"
				data-test="login-form-btn-submit"
				disabled={statusState.signIn.loading}
			>
				{statusState.signIn.loading ? (
					<Fragment>
						<Loader2 className="w-4 h-4 mr-2 text-black animate-spin" />
						<span>Please wait...</span>
					</Fragment>
				) : (
					'Login'
				)}
			</Button>
			<div className="flex flex-wrap items-center justify-between">
				<span
					className="text-sm text-center text-white"
					data-test="login-form-footer-info"
				>
					Don't have an account?
					<Button variant="link" onClick={handleSignUpClick}>
						Join now
					</Button>
				</span>
				<Button variant="link" onClick={handleForgotPasswordClick}>
					Forgot your password?
				</Button>
			</div>
		</form>
	);
}

export default Login;
