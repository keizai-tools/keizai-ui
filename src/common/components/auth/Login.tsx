import { User2 } from 'lucide-react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, redirect } from 'react-router-dom';

import PasswordInput from '../Input/PasswordInput';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

import { User } from '@/services/auth/domain/user';
import { useAuth } from '@/services/auth/hook/useAuth';

function Login() {
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
	const [error, setError] = React.useState('');
	const [isLoading, setIsLoading] = React.useState(false);
	const { signIn } = useAuth();

	const onSubmit = async (values: User) => {
		try {
			setIsLoading(true);
			await signIn(values);
			redirect('/');
		} catch (error) {
			console.error(error);
			setError('Invalid email or password');
			setIsLoading(false);
		}
	};

	return (
		<form
			className="md:w-1/2"
			data-test="login-form-container"
			onSubmit={handleSubmit(onSubmit)}
		>
			<h1
				className="text-primary font-bold text-4xl mb-7"
				data-test="login-form-title"
			>
				Welcome Back
			</h1>
			<div className="flex flex-col mb-4">
				<div className="flex items-center border-2 px-3 rounded-md bg-white">
					<User2 className="h-5 w-5 text-gray-400" />
					<Controller
						control={control}
						name="email"
						rules={{ required: 'Email Address is required' }}
						render={({ field }) => (
							<Input
								className="pl-2 border-none bg-white focus-visible:ring-0 text-black"
								type="text"
								placeholder="Email"
								data-test="login-form-username"
								{...field}
							/>
						)}
					/>
				</div>
				{errors.email && <p className="text-red-500">{errors.email.message}</p>}
			</div>
			<div className="flex flex-col mb-4">
				<Controller
					control={control}
					name="password"
					rules={{ required: 'Password is required' }}
					render={({ field }) => <PasswordInput {...field} />}
				/>
				{errors.password && (
					<p className="text-red-500">{errors.password.message}</p>
				)}
			</div>
			{!errors.password && !errors.email && error && (
				<p className="text-red-500">{error}</p>
			)}
			<Button
				type="submit"
				className="block w-full bg-primary dark:bg-primary mt-4 py-2 rounded-md text-black font-semibold mb-2"
				data-test="login-form-btn-submit"
				disabled={isLoading}
			>
				Login
			</Button>
			<span
				className="text-sm ml-2 text-white cursor-pointer"
				data-test="login-form-footer-info"
			>
				Don't have an account?{' '}
				<Link
					to="/register"
					className="text-primary"
					data-test="login-form-footer-link"
				>
					Join now
				</Link>
			</span>
		</form>
	);
}

export default Login;
