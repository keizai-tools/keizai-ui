import { AtSign } from 'lucide-react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import PasswordInput from '../Input/PasswordInput';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';

import { User } from '@/services/auth/domain/user';
import { useAuth } from '@/services/auth/hook/useAuth';

function CreateAccount() {
	const { toast } = useToast();
	const [error, setError] = React.useState('');
	const [loading, setLoading] = React.useState(false);
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
	const { signUp } = useAuth();

	const onSubmit = async (values: User) => {
		setLoading(true);
		try {
			await signUp(values);
			toast({
				title: 'Account created',
				description: 'Please verify your email',
			});
			setError('');
			setLoading(false);
		} catch (error) {
			console.error(error);
			setError('There was an error creating your account');
			setLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col md:w-1/2"
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
						rules={{ required: 'Email is required' }}
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
					<span className="text-red-500">{errors.email.message}</span>
				)}
			</div>
			<div>
				<Controller
					control={control}
					name="password"
					rules={{ required: 'Password is required' }}
					render={({ field }) => <PasswordInput {...field} />}
				/>
				{errors.password && (
					<span className="text-red-500">{errors.password.message}</span>
				)}
			</div>
			<Button
				type="submit"
				className="w-full bg-primary dark:bg-primary mt-4 py-2 rounded-md text-black font-semibold mb-2"
				data-test="register-form-btn-submit"
				disabled={loading}
			>
				Create
			</Button>
			{error && <span className="text-red-500 mb-5">{error}</span>}
			<span
				className="text-sm ml-2 text-white cursor-pointer"
				data-test="register-form-footer-info"
			>
				Already have an account?{' '}
				<Link
					to="/login"
					className="text-primary"
					data-test="register-form-footer-link"
				>
					Log in
				</Link>
			</span>
		</form>
	);
}

export default CreateAccount;
