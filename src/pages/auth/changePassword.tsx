import { Loader2 } from 'lucide-react';
import { Fragment } from 'react';
import { Controller, useForm } from 'react-hook-form';

import AlertError from '@/common/components/Form/AlertError';
import ErrorMessage from '@/common/components/Form/ErrorMessage';
import PasswordInput from '@/common/components/Input/PasswordInput';
import { Button } from '@/common/components/ui/button';
import { useAuthProvider } from '@/modules/auth/hooks/useAuthProvider';
import { AUTH_VALIDATIONS } from '@/modules/auth/message/auth-messages';

interface IPasswordReset {
	oldPassword: string;
	newPassword: string;
	confirmPassword: string;
}

interface Input {
	name: 'oldPassword' | 'newPassword' | 'confirmPassword';
	placeholder: string;
	rules: {
		required: string;
		pattern?: {
			value: RegExp;
			message: string;
		};
		validate?: (value: string) => string | boolean;
	};
	test: string;
}

enum INPUT_PLACEHOLDER {
	CONFIRM_PASSWORD = 'Confirm New Password',
	NEW_PASSWORD = 'New Password',
	OLD_PASSWORD = 'Old Password',
}

function ChangePassword() {
	const { handleChangePassword, statusState } = useAuthProvider();

	const {
		control,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			oldPassword: '',
			newPassword: '',
			confirmPassword: '',
		},
	});

	const inputs: Input[] = [
		{
			name: 'oldPassword',
			placeholder: INPUT_PLACEHOLDER.OLD_PASSWORD,
			rules: {
				required: AUTH_VALIDATIONS.OLD_PASSWORD_REQUIRED,
				pattern: {
					value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)/,
					message: AUTH_VALIDATIONS.PASSWORD_INVALID,
				},
			},
			test: 'old-password',
		},
		{
			name: 'newPassword',
			placeholder: INPUT_PLACEHOLDER.NEW_PASSWORD,
			rules: {
				required: AUTH_VALIDATIONS.NEW_PASSWORD_REQUIRED,
				pattern: {
					value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)/,
					message: AUTH_VALIDATIONS.PASSWORD_INVALID,
				},
			},
			test: 'new-password',
		},
		{
			name: 'confirmPassword',
			placeholder: INPUT_PLACEHOLDER.CONFIRM_PASSWORD,
			rules: {
				required: AUTH_VALIDATIONS.CONFIRM_PASSWORD_REQUIRED,
				validate: (value: string) => {
					return (
						value === watch('newPassword') ||
						AUTH_VALIDATIONS.CONFIRM_PASSWORD_NOT_MATCH
					);
				},
			},
			test: 'confirm-password',
		},
	];

	const onSubmit = async (values: IPasswordReset) => {
		const { oldPassword, newPassword } = values;
		await handleChangePassword(oldPassword, newPassword);
	};

	return (
		<div
			className="flex flex-col items-center justify-center w-full h-full m-10"
			data-test="change-password-container"
		>
			<form
				className="flex flex-col w-full h-full gap-4 p-6 font-bold border-2 border-solid rounded-lg shadow-lg border-offset-background max-w-prose"
				onSubmit={handleSubmit(onSubmit)}
				data-test="change-password-form-container"
			>
				<h1
					className="text-xl font-bold mb-7"
					data-test="change-password-title"
				>
					Change Password
				</h1>
				{inputs.map((input: Input) => (
					<div className="flex flex-col mb-4" key={input.name}>
						<Controller
							control={control}
							name={input.name}
							rules={input.rules}
							render={({ field }) => (
								<PasswordInput
									value={field.value}
									onChange={field.onChange}
									placeholder={input.placeholder}
								/>
							)}
						/>
						{errors[input.name] && (
							<ErrorMessage
								message={errors[input.name]?.message as string}
								testName={`${input.test}-error`}
								styles="text-sm"
								type={`${input.rules.pattern ? 'password' : ''}`}
							/>
						)}
					</div>
				))}
				{!errors.newPassword &&
					!errors.oldPassword &&
					!errors.confirmPassword &&
					statusState.changePassword.error && (
						<AlertError
							title="Change password failed"
							message={
								Array.isArray(statusState.changePassword.error)
									? statusState.changePassword.error.join(', ')
									: statusState.changePassword.error
							}
							testName="change-password-error-message"
						/>
					)}{' '}
				<Button
					type="submit"
					className={`w-full font-semibold ${
						statusState.changePassword.error ? 'mt-4' : ''
					}`}
					data-test="change-password-btn-submit"
					disabled={statusState.changePassword.loading}
				>
					{statusState.changePassword.loading ? (
						<Fragment>
							<Loader2 className="w-4 h-4 mr-2 text-black animate-spin" />
							Updating...
						</Fragment>
					) : (
						'Update password'
					)}
				</Button>
			</form>
		</div>
	);
}

export default ChangePassword;
