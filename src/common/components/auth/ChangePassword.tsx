import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import PasswordInput from '../Input/PasswordInput';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';

import { useAuth } from '@/services/auth/hook/useAuth';
import { AUTH_RESPONSE } from '@/services/auth/validators/authResponse';

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
		validate?: (value: string) => string | boolean;
	};
	test: string;
}

enum AUTH_VALIDATIONS {
	CONFIRM_PASSWORD_PLACEHOLDER = 'Confirm New Password',
	CONFIRM_PASSWORD_REQUIRED = 'Confirm password is required',
	CONFIRM_PASSWORD_NOT_MATCH = 'Passwords do not match',
	NEW_PASSWORD_PLACEHOLDER = 'New Password',
	NEW_PASSWORD_REQUIRED = 'New password is required',
	OLD_PASSWORD_PLACEHOLDER = 'Old Password',
	OLD_PASSWORD_REQUIRED = 'Old password is required',
}

function ChangePassword() {
	const navigate = useNavigate();
	const { toast } = useToast();
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
	const { changePassword } = useAuth();

	const inputs: Input[] = [
		{
			name: 'oldPassword',
			placeholder: AUTH_VALIDATIONS.OLD_PASSWORD_PLACEHOLDER,
			rules: { required: AUTH_VALIDATIONS.OLD_PASSWORD_REQUIRED },
			test: 'old-password',
		},
		{
			name: 'newPassword',
			placeholder: AUTH_VALIDATIONS.NEW_PASSWORD_PLACEHOLDER,
			rules: { required: AUTH_VALIDATIONS.NEW_PASSWORD_REQUIRED },
			test: 'new-password',
		},
		{
			name: 'confirmPassword',
			placeholder: AUTH_VALIDATIONS.CONFIRM_PASSWORD_PLACEHOLDER,
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

	const { mutate, isPending, error } = useMutation({
		mutationFn: changePassword,
		onSuccess: () => {
			navigate('/');
			toast({
				title: 'Successful!',
				description: AUTH_RESPONSE.PASSWORD_CHANGED,
			});
		},
	});

	const onSubmit = async (values: IPasswordReset) => {
		const { oldPassword, newPassword } = values;
		await mutate({
			oldPassword,
			newPassword,
		});
	};

	return (
		<form
			className="md:w-1/2 p-3"
			onSubmit={handleSubmit(onSubmit)}
			data-test="change-password-form-container"
		>
			<h1 className="font-bold text-xl mb-7" data-test="change-password-title">
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
						<p
							className="text-sm text-red-500 mt-1 pl-4"
							data-test={`${input.test}-error`}
						>
							{errors[input.name]?.message}
						</p>
					)}
				</div>
			))}
			{error && (
				<p
					className="text-red-500 mt-1 mb-4 pl-4"
					data-test="change-password-error-message"
				>
					{error.message}
				</p>
			)}
			<Button
				type="submit"
				className="w-full"
				data-test="change-password-btn-submit"
				disabled={isPending}
			>
				{isPending ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin text-black" />
						Updating...
					</>
				) : (
					'Update password'
				)}
			</Button>
		</form>
	);
}

export default ChangePassword;
