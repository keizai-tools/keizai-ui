import { ChevronRightSquare, Loader2 } from 'lucide-react';
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

export interface IPasswordReset {
	code: string;
	newPassword: string;
	confirmPassword: string;
	email: string;
}

function ResetPassword() {
	const { handleResetPassword, statusState } = useAuthProvider();

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
			email: '',
		},
	});

	const onSubmit = async (values: IPasswordReset) => {
		const { code, newPassword, email } = values;
		await handleResetPassword(email, newPassword, code);
	};

	return (
		<form
			className="w-full max-w-[500px]"
			onSubmit={handleSubmit(onSubmit)}
			data-test="forgot-password-form-container"
		>
			<h1
				className="text-4xl font-bold text-primary mb-7"
				data-test="forgot-password-title"
			>
				Password Reset
			</h1>
			<div className="flex flex-col mb-4">
				<div className="flex items-center px-3 bg-white border-2 rounded-md">
					<ChevronRightSquare className="w-5 h-5 text-gray-400" />
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
								className="pl-2 text-black bg-white border-none focus-visible:ring-0"
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
							value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)/,
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
				{statusState.resetPassword.error &&
					!statusState.resetPassword.loading && (
						<AlertError
							title="Reset password failed"
							message={
								Array.isArray(statusState.resetPassword.error)
									? statusState.resetPassword.error.join(', ')
									: statusState.resetPassword.error
							}
							testName="forgot-password-form-error"
						/>
					)}
			</div>
			<Button
				type="submit"
				className="w-full py-2 mt-8 mb-2 font-semibold text-black rounded-md"
				data-test="forgot-password-btn-submit"
				disabled={statusState.resetPassword.loading}
			>
				{statusState.resetPassword.loading ? (
					<Fragment>
						<Loader2 className="w-4 h-4 mr-2 text-black animate-spin" />
						<span>Saving...</span>
					</Fragment>
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
