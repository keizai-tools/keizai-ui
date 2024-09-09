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

function ErrorMessage({
	message,
	styles,
	testName,
	type,
}: Readonly<PropsErrorMessage>) {
	return (
		<div>
			<div
				className={`text-red-400 flex items-center gap-2 m-2 justify-center	w-full ${styles}`}
				data-test={testName}
			>
				<AlertCircle className="w-4 h-4" />
				<div className="flex flex-col ">
					{message.split('. ').map((part) => (
						<p key={part}>{part}</p>
					))}
				</div>
			</div>
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
		</div>
	);
}

export default ErrorMessage;
