import { AtSign, Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import AlertError from '../Form/AlertError';
import ErrorMessage from '../Form/ErrorMessage';
import PasswordInput from '../Input/PasswordInput';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

import { useCreateAccountMutation } from '@/services/auth/api/cognito';
import { User } from '@/services/auth/domain/user';
import { AUTH_VALIDATIONS } from '@/services/auth/validators/auth-response';

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
	const { mutation, error } = useCreateAccountMutation();
	const { mutate, isPending } = mutation;

	const onSubmit = async (values: User) => {
		await mutate(values);
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col w-full max-w-[500px] px-2 gap-1"
			data-test="register-form-container"
		>
			<h1
				className="text-primary font-bold text-4xl mb-7"
				data-test="register-form-title"
			>
				Create Account
			</h1>
			<div className="flex flex-col mb-4">
				<div className="flex items-center border-2 px-3 rounded-md bg-white">
					<AtSign className="h-5 w-5 text-gray-400" />
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
								className="pl-2 border-none bg-white focus-visible:ring-0 text-black"
								type="text"
								placeholder="Email"
								data-test="register-form-email"
								{...field}
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
							value:
								/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,255}$/,
							message: AUTH_VALIDATIONS.PASSWORD_INVALID,
						},
					}}
					render={({ field }) => <PasswordInput {...field} />}
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
			{!errors.email && !errors.password && error && (
				<AlertError
					title="Create account failed"
					message={error}
					testName="register-form-create-error"
				/>
			)}
			<Button
				type="submit"
				className="w-full mt-8 py-2 rounded-md text-black font-semibold mb-2"
				data-test="register-form-btn-submit"
				disabled={isPending}
			>
				{isPending ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin text-black" />
						Creating...
					</>
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
