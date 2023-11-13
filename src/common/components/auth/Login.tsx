import { Loader2, AtSign } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import AlertError from '../Form/AlertError';
import ErrorMessage from '../Form/ErrorMessage';
import PasswordInput from '../Input/PasswordInput';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

import { useLoginCognitoMutation } from '@/services/auth/api/cognito';
import { User } from '@/services/auth/domain/user';
import { AUTH_VALIDATIONS } from '@/services/auth/validators/auth-response.enum';

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
	const { error, isPending, onLoginSubmit } = useLoginCognitoMutation();

	const onSubmit = async (values: User) => {
		await onLoginSubmit(values);
	};

	return (
		<form
			className="w-full max-w-[500px] px-2 flex flex-col gap-1"
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
					<AtSign className="h-5 w-5 text-gray-400" />
					<Controller
						control={control}
						name="email"
						rules={{
							required: AUTH_VALIDATIONS.EMAIL_REQUIRED,
						}}
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
			{!errors.password && !errors.email && error && (
				<AlertError
					title="Login failed"
					message={error}
					testName="login-form-error-message"
				/>
			)}
			<Button
				type="submit"
				className="w-full py-2 rounded-md text-black font-semibold mb-2 mt-8"
				data-test="login-form-btn-submit"
				disabled={isPending}
			>
				{isPending ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin text-black" />
						<span>Please wait...</span>
					</>
				) : (
					'Login'
				)}
			</Button>
			<div className="flex justify-between items-center flex-wrap">
				<span
					className="text-center text-sm text-white"
					data-test="login-form-footer-info"
				>
					Don't have an account?
					<Button variant="link" asChild>
						<Link
							to="/auth/register"
							className="text-primary"
							data-test="login-form-footer-register-link"
						>
							Join now
						</Link>
					</Button>
				</span>
				<Button variant="link" asChild>
					<Link
						to="/auth/forgot-password"
						className="text-primary "
						data-test="login-form-footer-password-link"
					>
						Forgot your password?
					</Link>
				</Button>
			</div>
		</form>
	);
}

export default Login;
