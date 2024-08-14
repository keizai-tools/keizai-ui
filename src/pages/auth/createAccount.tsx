import { AtSign, Loader2 } from 'lucide-react';
import { Fragment } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import AlertError from '@/common/components/form/alertError';
import ErrorMessage from '@/common/components/form/errorMessage';
import PasswordInput from '@/common/components/input/passwordInput';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { useAuthProvider } from '@/modules/auth/hooks/useAuthProvider';
import { AUTH_VALIDATIONS } from '@/modules/auth/message/auth-messages';

function CreateAccount() {
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
	const { handleSignUp, statusState } = useAuthProvider();

	const onSubmit = async (values: { email: string; password: string }) => {
		await handleSignUp(values.email, values.password);
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col w-full max-w-[500px] px-2 gap-1"
			data-test="register-form-container"
		>
			<h1
				className="text-4xl font-bold text-primary mb-7"
				data-test="register-form-title"
			>
				Create Account
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
								data-test="register-form-email"
								value={field.value}
								onChange={field.onChange}
							/>
						)}
					/>
				</div>
				{errors.email && (
					<ErrorMessage
						message={errors.email.message as string}
						testName="register-form-email-error"
						styles="text-sm"
					/>
				)}
			</div>
			<div>
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
						testName="register-form-password-error"
						styles="text-sm"
						type="password"
					/>
				)}
			</div>
			{!errors.email &&
				!errors.password &&
				(statusState.signUp.error || statusState.signUp.error?.length) && (
					<AlertError
						title="Create account failed"
						message={
							Array.isArray(statusState.signUp.error)
								? statusState.signUp.error.join(', ')
								: statusState.signUp.error
						}
						testName="register-form-create-error"
					/>
				)}
			<Button
				type="submit"
				className="w-full py-2 mt-8 mb-2 font-semibold text-black rounded-md"
				data-test="register-form-btn-submit"
				disabled={statusState.signUp.loading}
			>
				{statusState.signUp.loading ? (
					<Fragment>
						<Loader2 className="w-4 h-4 mr-2 text-black animate-spin" />
						Creating...
					</Fragment>
				) : (
					'Create'
				)}
			</Button>
			<span
				className="text-sm text-white"
				data-test="register-form-footer-info"
			>
				Already have an account?
				<Button variant="link" asChild>
					<Link to="/auth/login" data-test="register-form-footer-link">
						Login
					</Link>
				</Button>
			</span>
		</form>
	);
}

export default CreateAccount;
