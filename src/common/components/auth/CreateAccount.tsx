import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { AtSign, Loader2 } from 'lucide-react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import PasswordInput from '../Input/PasswordInput';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';

import { User } from '@/services/auth/domain/user';
import { useAuth } from '@/services/auth/hook/useAuth';
import { AUTH_VALIDATIONS } from '@/services/auth/validators/authResponse';

function CreateAccount() {
	const { toast } = useToast();
	const [error, setError] = React.useState<string>('');
	const {
		control,
		handleSubmit,
		formState: { errors, isDirty },
	} = useForm({
		defaultValues: {
			email: '',
			password: '',
		},
	});
	const { signUp } = useAuth();
	const { mutate, isPending, isError } = useMutation({
		mutationFn: signUp,
		onSuccess: () => {
			toast({
				title: 'Account created',
				description: 'Please verify your email',
			});
			setError('');
		},
		onError: (error: AxiosError<Error>) => {
			if (error.response) {
				setError(error.response.data.message);
			}
		},
	});
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
					<span
						className="text-sm text-red-500 ml-4 mt-1"
						data-test="register-form-email-error"
					>
						{errors.email.message}
					</span>
				)}
			</div>
			<div>
				<Controller
					control={control}
					name="password"
					rules={{
						required: 'Password is required',
						pattern: {
							value:
								/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,255}$/,
							message: AUTH_VALIDATIONS.PASSWORD_INVALID,
						},
					}}
					render={({ field }) => <PasswordInput {...field} />}
				/>
				{errors.password && (
					<p className="ml-4">
						<span
							className="text-sm text-red-500 mt-1"
							data-test="register-form-password-error"
						>
							{errors.password.message}
						</span>
					</p>
				)}
			</div>
			{isError && isDirty && (
				<span
					className=" text-red-500 mt-2 ml-4"
					data-test="register-form-create-error"
				>
					{error}
				</span>
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
