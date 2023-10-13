import InvocationPage from '../default/InvocationPage';

import Breadcrumb from '@/common/components/Breadcrumb/Breadcrumb';
import Collections from '@/common/components/Collections/Collections';
import ContractInput from '@/common/components/Input/ContractInput';
import FunctionsTab from '@/common/components/Tabs/FunctionsTab/FunctionsTab';
import Terminal from '@/common/components/ui/Terminal';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@/common/components/ui/tabs';
import { useInvocation } from '@/common/hooks/useInvocation';

const tabs: Record<string, string> = {
	functions: 'Functions',
	authorizations: 'Authorization',
	preInvocateScript: 'Pre-invocate script',
	tests: 'Tests',
	events: 'Events',
};

export default function Home() {
	const { loadContractToInvocation } = useInvocation();

	return (
		<main className="flex flex-1">
			<Collections />
			<InvocationPage>
				<div className="flex flex-col p-3 w-full gap-7">
					<Breadcrumb
						contractName="Counter contract"
						folderName="Basic use case"
						contractInvocationName="Get current counter"
					/>
					<ContractInput loadContract={loadContractToInvocation} />
					<Tabs
						defaultValue="functions"
						className=""
						data-test="tabs-container"
					>
						<TabsList className="" data-test="tabs-list-container">
							{Object.keys(tabs).map((tab) => (
								<TabsTrigger key={tab} value={tab} className="">
									{tabs[tab]}
								</TabsTrigger>
							))}
						</TabsList>
						<TabsContent value="functions">
							<FunctionsTab />
						</TabsContent>
					</Tabs>
				</div>
				<Terminal />
			</InvocationPage>
		</main>
	);
}
