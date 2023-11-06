import { AlertCircle } from 'lucide-react';

type PropsErrorMessage = {
	message: string;
	styles?: string;
	testName: string;
	type?: string;
};

const passwordRequeriment = [
	'8 characters minimum',
	'1 uppercase character and 1 lowercase character',
	'1 number',
	'1 special character',
];

function ErrorMessage({ message, styles, testName, type }: PropsErrorMessage) {
	return (
		<>
			<p
				className={`text-red-500 flex items-center gap-1 ml-4 mt-2 ${styles}`}
				data-test={testName}
			>
				<AlertCircle className="h-4 w-4" />
				{message}
			</p>
			{type === 'password' && !message.includes('required') && (
				<ul
					className="text-sm text-red-500 ml-12"
					data-test="password-error-requeriment"
				>
					{passwordRequeriment.map((req, index) => (
						<li className="mt-1" key={index}>
							&#8226; {req}
						</li>
					))}
				</ul>
			)}
		</>
	);
}

export default ErrorMessage;
