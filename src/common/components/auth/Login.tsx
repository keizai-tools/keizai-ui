import { useMutation } from '@tanstack/react-query';
import { Form, Formik } from 'formik';
import { User2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import PasswordInput from '../Input/PasswordInput';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

import { User } from '@/services/auth/domain/user';
import useAuth from '@/services/auth/hook/useAuth';

function Login() {
	const { formData, onChangeInput, loginUser } = useAuth();
	const { mutate } = useMutation({
		mutationFn: loginUser,
		onSuccess: () => {
			navigate('/');
		},
	});
	const navigate = useNavigate();

	const onSubmit = (values: User) => {
		mutate(values);
	};

	return (
		<Formik
			initialValues={formData}
			enableReinitialize={true}
			onSubmit={onSubmit}
		>
			<Form className="md:w-1/2" data-test="login-form-container">
				<h1
					className="text-primary font-bold text-4xl mb-7"
					data-test="login-form-title"
				>
					Welcome Back
				</h1>
				<div className="flex items-center border-2 px-3 rounded-md mb-4 bg-white">
					<User2 className="h-5 w-5 text-gray-400" />
					<Input
						className="pl-2 border-none bg-white focus-visible:ring-0 text-black"
						type="text"
						placeholder="Username"
						name="username"
						data-test="login-form-username"
						onChange={onChangeInput}
					/>
				</div>
				<PasswordInput onChange={onChangeInput} />
				<Button
					type="submit"
					className="block w-full bg-primary dark:bg-primary mt-4 py-2 rounded-md text-black font-semibold mb-2"
					data-test="login-form-btn-submit"
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
			</Form>
		</Formik>
	);
}

export default Login;
