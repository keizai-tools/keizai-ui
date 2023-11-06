import { ChevronRightSquare, Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import AlertError from '../Form/AlertError';
import ErrorMessage from '../Form/ErrorMessage';
import PasswordInput from '../Input/PasswordInput';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

import { useResetPasswordMutation } from '@/services/auth/api/cognito';
import { AUTH_VALIDATIONS } from '@/services/auth/validators/authResponse';

export interface IPasswordReset {
	code: string;
	newPassword: string;
	confirmPassword: string;
}

function ResetPassword() {
	const { mutation, error, loading, setLoading } = useResetPasswordMutation();
	const { mutate, isPending, isError } = mutation;

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

	const onSubmit = async (values: IPasswordReset) => {
		setLoading(true);
		const { code, newPassword } = values;
		await mutate({ code, newPassword });
	};

	return (
		<form
			className="w-full max-w-[500px]"
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
						rules={{
							required: AUTH_VALIDATIONS.CODE_REQUIRED,
							pattern: {
								value: /^\d{6}$/,
								message: AUTH_VALIDATIONS.CODE_INVALID,
							},
						}}
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
					<ErrorMessage
						message={errors.code.message as string}
						testName="forgot-password-code-error"
						styles="text-sm"
					/>
				)}
			</div>
			<div className="flex flex-col mb-4">
				<Controller
					control={control}
					name="newPassword"
					rules={{
						required: AUTH_VALIDATIONS.NEW_PASSWORD_REQUIRED,
						pattern: {
							value:
								/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,255}$/,
							message: AUTH_VALIDATIONS.PASSWORD_INVALID,
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
					<ErrorMessage
						message={errors.newPassword.message as string}
						testName="new-password-error-message"
						styles="text-sm"
						type="password"
					/>
				)}
			</div>
			<div className="flex flex-col mb-4">
				<Controller
					control={control}
					name="confirmPassword"
					rules={{
						required: AUTH_VALIDATIONS.CONFIRM_PASSWORD_REQUIRED,
						validate: (value) => {
							return (
								value === watch('newPassword') ||
								AUTH_VALIDATIONS.CONFIRM_PASSWORD_NOT_MATCH
							);
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
					<ErrorMessage
						message={errors.confirmPassword.message as string}
						testName="confirm-password-reset-error"
						styles="text-sm"
					/>
				)}
				{isError && !loading && error && (
					<AlertError
						title="Reset password failed"
						message={error}
						testName="forgot-password-form-error"
					/>
				)}
			</div>
			<Button
				type="submit"
				className="w-full mt-8 py-2 rounded-md text-black font-semibold mb-2"
				data-test="forgot-password-btn-submit"
				disabled={isPending}
			>
				{isPending ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin text-black" />
						<span>Saving...</span>
					</>
				) : (
					'Save'
				)}
			</Button>
			<div
				className="flex items-center ml-2"
				data-test="forgot-password-footer-info"
			>
				<span className="text-sm ">Already have an account?</span>
				<Button variant="link" asChild>
					<Link
						to="/auth/login"
						className="text-primary"
						data-test="forgot-password-footer-link"
					>
						Login
					</Link>
				</Button>
			</div>
		</form>
	);
}

export default ResetPassword;
