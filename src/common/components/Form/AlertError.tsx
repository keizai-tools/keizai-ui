import { AlertCircle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

type AlertErrorProps = {
	title: string;
	message: string;
	testName: string;
};

function AlertError({ title, message, testName }: AlertErrorProps) {
	return (
		<Alert
			variant="destructive"
			className="mt-4"
			data-test={`${testName}-container`}
		>
			<AlertCircle className="w-4 h-4" />
			<AlertTitle className="mb-2" data-test={`${testName}-title`}>
				{title}
			</AlertTitle>
			<AlertDescription data-test={`${testName}-info`}>
				{message}
			</AlertDescription>
		</Alert>
	);
}

export default AlertError;
