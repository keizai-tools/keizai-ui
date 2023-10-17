import { Form, Formik } from 'formik';
import { AtSign } from 'lucide-react';
import { Link } from 'react-router-dom';

import PasswordInput from '../Input/PasswordInput';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const INITIAL_VALUES = {
	username: '',
	password: '',
};

function CreateAccount() {
	return (
		<Formik
			initialValues={INITIAL_VALUES}
			enableReinitialize={true}
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			onSubmit={() => {}}
		>
			<Form className="md:w-1/2" data-test="register-form-container">
				<h1
					className="text-primary font-bold text-4xl mb-7"
					data-test="register-form-title"
				>
					Create Account
				</h1>
				<div className="flex items-center border-2 px-3 rounded-md mb-4 bg-white">
					<AtSign className="h-5 w-5 text-gray-400" />
					<Input
						className="pl-2 border-none bg-white focus-visible:ring-0 text-black"
						type="text"
						placeholder="Email"
						name="email"
						data-test="register-form-email"
					/>
				</div>
				<PasswordInput />
				<Button
					type="submit"
					className="block w-full bg-primary dark:bg-primary mt-4 py-2 rounded-md text-black font-semibold mb-2"
					data-test="register-form-btn-submit"
				>
					Create
				</Button>
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
			</Form>
		</Formik>
	);
}

export default CreateAccount;
