import Breadcrumb from '@/common/components/Breadcrumb/Breadcrumb';
import ContractInput from '@/common/components/Input/ContractInput';

export default function Home() {
	return (
		<main className="flex flex-1">
			<div className="flex flex-col p-3 w-full gap-7">
				<Breadcrumb
					contractName="Counter contract"
					folderName="Basic use case"
					contractInvocationName="Get current counter"
				/>
				<ContractInput />
			</div>
		</main>
	);
}
