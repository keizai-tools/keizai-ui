import { Form, Formik } from 'formik';
import { User2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import PasswordInput from '../Input/PasswordInput';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const INITIAL_VALUES = {
	username: '',
	password: '',
};

function Login() {
	return (
		<Formik
			initialValues={INITIAL_VALUES}
			enableReinitialize={true}
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			onSubmit={() => {}}
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
					/>
				</div>
				<PasswordInput />
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
