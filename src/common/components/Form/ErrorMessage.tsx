import { AlertCircle } from 'lucide-react';
import { Fragment } from 'react';

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

function ErrorMessage({
	message,
	styles,
	testName,
	type,
}: Readonly<PropsErrorMessage>) {
	return (
		<Fragment>
			<p
				className={`text-red-500 flex items-center gap-1 ml-4 mt-2 ${styles}`}
				data-test={testName}
			>
				<AlertCircle className="w-4 h-4" />
				{message}
			</p>
			{type === 'password' && !message.includes('required') && (
				<ul
					className="ml-12 text-sm text-red-500"
					data-test="password-error-requeriment"
				>
					{passwordRequeriment.map((req) => (
						<li className="mt-1" key={req}>
							&#8226; {req}
						</li>
					))}
				</ul>
			)}
		</Fragment>
	);
}

export default ErrorMessage;
