import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import PasswordInput from '../Input/PasswordInput';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';

import { useAuth } from '@/services/auth/hook/useAuth';

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

function ChangePassword() {
	const navigate = useNavigate();
	const { toast } = useToast();
	const [error, setError] = React.useState('');
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
			placeholder: 'Old Password',
			rules: { required: 'Old password is required' },
			test: 'old-password',
		},
		{
			name: 'newPassword',
			placeholder: 'New Password',
			rules: { required: 'New password is required' },
			test: 'new-password',
		},
		{
			name: 'confirmPassword',
			placeholder: 'Confirm New Password',
			rules: {
				required: 'Confirm password is required',
				validate: (value: string) => {
					return value === watch('newPassword') || 'Passwords do not match';
				},
			},
			test: 'confirm-password',
		},
	];

	const { mutate, isPending } = useMutation({
		mutationFn: changePassword,
		onSuccess: () => {
			navigate('/');
			toast({
				title: 'Successful!',
				description: 'You have changed your password',
			});
			setError('');
		},
		onError: (error) => {
			console.error(error);
			setError('There was an error updating your password');
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
			className="md:w-1/2 p-10"
			onSubmit={handleSubmit(onSubmit)}
			data-test="change-password-form-container"
		>
			<h1
				className="text-primary font-bold text-4xl mb-7"
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
						<p
							className="text-sm text-red-500 mt-1 pl-4"
							data-test={`${input.test}-error`}
						>
							{errors[input.name]?.message}
						</p>
					)}
				</div>
			))}
			{error && <p className="text-sm text-red-500 mt-1 pl-4">{error}</p>}
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
