import { ENVIRONMENTS } from '@/common/exceptions/environments';

type IProps = {
	styles: string;
	testName: string;
};

function EnvironmentEmptyState({ styles, testName }: Readonly<IProps>) {
	return (
		<p className={`px-4 italic text-slate-400 ${styles}`} data-test={testName}>
			{ENVIRONMENTS.EMPTY_STATE}
		</p>
	);
}

export default EnvironmentEmptyState;
