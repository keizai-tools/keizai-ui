import { Loader } from 'lucide-react';
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

import useInvocation from './useInvocation';

import {
	useInvocationQuery,
	useRunInvocationQuery,
} from '@/common/api/invocations';
import Breadcrumb from '@/common/components/Breadcrumb/Breadcrumb';
import ContractInput from '@/common/components/Input/ContractInput';
import AuthorizationTab from '@/common/components/Tabs/AuthorizationTab/AuthorizationTab';
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
import { Invocation } from '@/common/types/invocation';

const tabs: Record<string, string> = {
	functions: 'Functions',
	authorization: 'Authorization',
	preInvocateScript: 'Pre-invocate script',
	tests: 'Tests',
	events: 'Events tracker',
};

const disabledTabs = ['preInvocateScript', 'tests', 'events'];

export type InvocationForm = {
	contractId?: string | null;
	selectedMethod?: string | null;
	parameters?: { id: string; key: string; value: string }[];
};

const InvocationPageContent = ({ data }: { data: Invocation }) => {
	const [isRunning, setIsRunning] = React.useState(false);
	const [responses, setResponses] = React.useState<string[]>([]);
	const runInvocation = useRunInvocationQuery({ id: data.id });
	const { handleLoadContract, isLoadingContract } = useInvocation({
		invocationId: data.id ?? '',
	});

	return (
		<div
			className="flex flex-col p-3 w-full gap-4 max-h-screen"
			data-test="invocation-section-container"
		>
			<Breadcrumb
				contractName="Collection"
				folderName={data.folder?.name || ''}
				contractInvocationName={data.name}
			/>
			<ContractInput
				defaultValue={data.contractId || ''}
				loadContract={handleLoadContract}
				runInvocation={async () => {
					setIsRunning(true);
					const response = await runInvocation();

					if (response) {
						setResponses((prev) => [...prev, response]);
						setIsRunning(false);
					}
				}}
				loading={isLoadingContract || isRunning}
			/>
			<Tabs
				defaultValue="functions"
				className="flex-1"
				data-test="tabs-container"
			>
				<TabsList className="" data-test="tabs-list-container">
					{Object.keys(tabs).map((tab) => {
						if (disabledTabs.includes(tab)) {
							return (
								<Tooltip key={tab} delayDuration={50}>
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
					<FunctionsTab
						invocationId={data.id}
						methods={data.methods}
						selectedMethod={data.selectedMethod}
					/>
				</TabsContent>
				<TabsContent value="authorization">
					<AuthorizationTab
						invocationId={data.id}
						defaultValues={{
							secretKey: data.secretKey,
							publicKey: data.publicKey,
						}}
					/>
				</TabsContent>
			</Tabs>
			<Terminal responses={responses} />
		</div>
	);
};

const InvocationPage = () => {
	const params = useParams();
	const { data, isLoading, isRefetching, error } = useInvocationQuery({
		id: params.invocationId,
	});

	if (isLoading || isRefetching) {
		return (
			<div className="flex flex-1 h-full w-full justify-center items-center">
				<Loader className="animate-spin" size="36" />
			</div>
		);
	}

	if (error) {
		return <Navigate to="/collection" replace={true} />;
	}

	if (!data) {
		return null;
	}

	return <InvocationPageContent data={data} />;
};

export default InvocationPage;
