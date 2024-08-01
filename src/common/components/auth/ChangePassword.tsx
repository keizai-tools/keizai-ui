import { Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

import AlertError from '../Form/AlertError';
import ErrorMessage from '../Form/ErrorMessage';
import PasswordInput from '../Input/PasswordInput';
import { Button } from '../ui/button';

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
	// const { mutation, error } = useChangePasswordMutation();
	// const { mutate, isPending } = mutation;
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
		// const { oldPassword, newPassword } = values;
		// await mutate({
		// 	oldPassword,
		// 	newPassword,
		// });
	};

	return (
		<form
			className="w-full max-w-[500px] p-3"
			onSubmit={handleSubmit(onSubmit)}
			data-test="change-password-form-container"
		>
			<h1 className="text-xl font-bold mb-7" data-test="change-password-title">
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
			{/* {!errors.newPassword &&
				!errors.oldPassword &&
				!errors.confirmPassword &&
				error && (
					<AlertError
						title="Change password failed"
						message={error}
						testName="change-password-error-message"
					/>
				)} */}
			{/* <Button
				type="submit"
				className={`w-full font-semibold ${error ? 'mt-4' : ''}`}
				data-test="change-password-btn-submit"
				disabled={isPending}
			>
				{isPending ? (
					<>
						<Loader2 className="w-4 h-4 mr-2 text-black animate-spin" />
						Updating...
					</>
				) : (
					'Update password'
				)}
			</Button> */}
		</form>
	);
}

export default ChangePassword;
