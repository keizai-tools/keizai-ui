import InvocationPage from '../default/InvocationPage';

import Breadcrumb from '@/common/components/Breadcrumb/Breadcrumb';
import Folders from '@/common/components/Collections/Folders';
import ContractInput from '@/common/components/Input/ContractInput';
import FunctionsTab from '@/common/components/Tabs/FunctionsTab/FunctionsTab';
import Terminal from '@/common/components/ui/Terminal';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@/common/components/ui/tabs';

const tabs: Record<string, string> = {
	functions: 'Functions',
	authorizations: 'Authorization',
	preInvocateScript: 'Pre-invocate script',
	tests: 'Tests',
	events: 'Events',
};

const CollectionPage = () => {
	return (
		<main className="flex flex-1">
			<Folders />
			<InvocationPage>
				<div className="flex flex-col p-3 w-full gap-7">
					<Breadcrumb
						contractName="Counter contract"
						folderName="Basic use case"
						contractInvocationName="Get current counter"
					/>
					{/* TODO Implement load contract  */}
					{/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
					<ContractInput loadContract={() => {}} />
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
};

export default CollectionPage;
