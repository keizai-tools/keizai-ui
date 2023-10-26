import { Loader } from 'lucide-react';
import { useParams } from 'react-router-dom';

import { useInvocationQuery } from '@/common/api/invocations';
import Breadcrumb from '@/common/components/Breadcrumb/Breadcrumb';
import ContractInput from '@/common/components/Input/ContractInput';
import AuthorizationsTab from '@/common/components/Tabs/FunctionsTab/AuthorizationsTab';
import FunctionsTab from '@/common/components/Tabs/FunctionsTab/FunctionsTab';
import Terminal from '@/common/components/ui/Terminal';
import { Button } from '@/common/components/ui/button';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@/common/components/ui/tabs';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/common/components/ui/tooltip';

const tabs: Record<string, string> = {
	functions: 'Functions',
	authorizations: 'Authorization',
	preInvocateScript: 'Pre-invocate script',
	tests: 'Tests',
	events: 'Events',
};

const disabledTabs = ['preInvocateScript', 'tests', 'events'];

const InvocationPage = () => {
	const params = useParams();
	const { data, isLoading } = useInvocationQuery({
		id: params.invocationId,
	});

	if (isLoading) {
		return (
			<div className="flex flex-1 h-full w-full justify-center items-center">
				<Loader className="animate-spin" size="36" />
			</div>
		);
	}

	return (
		<div
			className="flex flex-col p-3 w-full gap-4"
			data-test="invocation-section-container"
		>
			<Breadcrumb
				contractName="Collection"
				folderName={data.folder.name}
				contractInvocationName={data.name}
			/>
			{/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
			<ContractInput loadContract={() => {}} />
			<Tabs
				defaultValue="functions"
				className="flex-1"
				data-test="tabs-container"
			>
				<TabsList className="" data-test="tabs-list-container">
					{Object.keys(tabs).map((tab) => {
						if (disabledTabs.includes(tab)) {
							return (
								<Tooltip delayDuration={50}>
									<TooltipTrigger asChild>
										<Button
											variant="link"
											className="hover:no-underline text-slate-600"
										>
											{tabs[tab]}
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Coming soon</p>
									</TooltipContent>
								</Tooltip>
							);
						}

						return (
							<TabsTrigger
								key={tab}
								value={tab}
								disabled={disabledTabs.includes(tab)}
								data-test={`functions-tabs-${tab}`}
							>
								{tabs[tab]}
							</TabsTrigger>
						);
					})}
				</TabsList>
				<TabsContent value="functions">
					<FunctionsTab methods={data.methods} />
				</TabsContent>
				<TabsContent value="authorizations">
					<AuthorizationsTab />
				</TabsContent>
			</Tabs>
			<Terminal />
		</div>
	);
};

export default InvocationPage;
