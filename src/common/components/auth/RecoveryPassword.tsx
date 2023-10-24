import { useMutation } from '@tanstack/react-query';
import { AtSign } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Button } from '../ui/button';
import { Input } from '../ui/input';

import { useAuth } from '@/services/auth/hook/useAuth';

interface Username {
	username: string;
}

function RecoveryPassword() {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			username: '',
		},
	});
	const navigate = useNavigate();
	const { forgotPassword } = useAuth();
	const { mutate, isPending } = useMutation({
		mutationFn: forgotPassword,
		onSuccess: () => {
			navigate('/reset-password');
		},
	});

	const onSubmit = async (values: Username) => {
		const { username } = values;
		await mutate(username);
	};
	return (
		<form
			className="md:w-1/2"
			onSubmit={handleSubmit(onSubmit)}
			data-test="recovery-password-form-container"
		>
			<h1
				className="text-primary font-bold text-4xl mb-7"
				data-test="recovery-password-title"
			>
				Password Recovery
			</h1>
			<div className="flex flex-col mb-4">
				<div className="flex items-center border-2 px-3 rounded-md bg-white">
					<AtSign className="h-5 w-5 text-gray-400" />
					<Controller
						control={control}
						name="username"
						rules={{ required: 'Email is required' }}
						render={({ field }) => (
							<Input
								className="pl-2 border-none bg-white focus-visible:ring-0 text-black"
								type="text"
								placeholder="Email"
								data-test="recovery-password-email-send-code"
								{...field}
							/>
						)}
					/>
				</div>
				{errors.username && (
					<span
						className="text-sm text-red-500 mt-2 pl-4"
						data-test="recovery-password-error"
					>
						{errors.username.message}
					</span>
				)}
			</div>
			<Button
				type="submit"
				className="block w-full bg-primary dark:bg-primary mt-4 py-2 rounded-md text-black font-semibold mb-2"
				data-test="recovery-password-btn-submit"
				disabled={isPending}
			>
				{isPending ? 'Sending...' : 'Send code'}
			</Button>
		</form>
	);
}

export default RecoveryPassword;
