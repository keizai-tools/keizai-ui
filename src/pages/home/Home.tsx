import Breadcrumb from '@/common/components/Breadcrumb/Breadcrumb';
import Collections from '@/common/components/Collections/Collections';
import ContractInput from '@/common/components/Input/ContractInput';

export default function Home() {
	return (
		<main
			className="flex flex-col flex-1 justify-between"
			data-test="home-page-container"
		>
			<div
				className="flex flex-col p-3 w-full gap-7"
				data-test="home-page-container"
			>
				<Collections />
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
