import { AtSign, Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

import ErrorMessage from '../Form/ErrorMessage';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

import { useRecoverPasswordMutation } from '@/services/auth/api/cognito';
import { AUTH_VALIDATIONS } from '@/services/auth/validators/auth-response.enum';

interface Username {
	username: string;
}

function RecoverPassword() {
	const { mutate, isPending } = useRecoverPasswordMutation();
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			username: '',
		},
	});

	const onSubmit = async (values: Username) => {
		const { username } = values;
		await mutate(username);
	};

	return (
		<form
			className="flex flex-col w-full max-w-[500px] px-2"
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
								data-test="recovery-password-email-send-code"
								{...field}
							/>
						)}
					/>
				</div>
				{errors.username && (
					<ErrorMessage
						message={errors.username.message as string}
						testName="recovery-password-error"
						styles="text-sm"
					/>
				)}
			</div>
			<Button
				type="submit"
				className="mt-8 py-2 rounded-md text-black font-semibold mb-2"
				data-test="recovery-password-btn-submit"
				disabled={isPending}
			>
				{isPending ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin text-black" />
						<span>Sending...</span>
					</>
				) : (
					'Send code'
				)}
			</Button>
		</form>
	);
}

export default RecoverPassword;
