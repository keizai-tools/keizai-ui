import { AtSign, Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import ErrorMessage from '../../common/components/Form/ErrorMessage';
import { Button } from '../../common/components/ui/button';
import { Input } from '../../common/components/ui/input';

import { useAuthProvider } from '@/modules/auth/hooks/useAuthProvider';
import { AUTH_VALIDATIONS } from '@/modules/auth/message/auth-messages';

function RecoverPassword() {
	const { handleForgotPassword, loadingState } = useAuthProvider();
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			email: '',
		},
	});

	const onSubmit = async (values: { email: string }) => {
		await handleForgotPassword(values.email);
	};

	return (
		<form
			className="flex flex-col w-full max-w-[500px] px-2"
			onSubmit={handleSubmit(onSubmit)}
			data-test="recovery-password-form-container"
		>
			<h1
				className="text-4xl font-bold text-primary mb-7"
				data-test="recovery-password-title"
			>
				Password Recovery
			</h1>
			<div className="flex flex-col mb-4">
				<div className="flex items-center px-3 bg-white border-2 rounded-md">
					<AtSign className="w-5 h-5 text-gray-400" />
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
								className="pl-2 text-black bg-white border-none focus-visible:ring-0"
								type="text"
								placeholder="Email"
								data-test="recovery-password-email-send-code"
								{...field}
							/>
						)}
					/>
				</div>
				{errors.email && (
					<ErrorMessage
						message={errors.email.message as string}
						testName="recovery-password-error"
						styles="text-sm"
					/>
				)}
			</div>
			<Button
				type="submit"
				className="py-2 mt-8 mb-2 font-semibold text-black rounded-md"
				data-test="recovery-password-btn-submit"
				disabled={loadingState.forgotPassword}
			>
				{loadingState.forgotPassword ? (
					<>
						<Loader2 className="w-4 h-4 mr-2 text-black animate-spin" />
						<span>Sending...</span>
					</>
				) : (
					'Send code'
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

export default RecoverPassword;
