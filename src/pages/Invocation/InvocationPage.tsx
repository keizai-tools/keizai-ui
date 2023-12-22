import { AlertCircle, Loader } from 'lucide-react';
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

import useInvocation from './useInvocation';

import { useInvocationQuery } from '@/common/api/invocations';
import Breadcrumb from '@/common/components/Breadcrumb/Breadcrumb';
import ContractInput from '@/common/components/Input/ContractInput';
import AuthorizationTab from '@/common/components/Tabs/AuthorizationTab/AuthorizationTab';
import EventsTab from '@/common/components/Tabs/EventsTab/EventsTab';
import FunctionsTab from '@/common/components/Tabs/FunctionsTab/FunctionsTab';
import PreInvocateTab from '@/common/components/Tabs/PreInvocateTab/PreInvocateTab';
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
import useEditor from '@/common/hooks/useEditor';
import { Invocation } from '@/common/types/invocation';

const tabs: Record<string, string> = {
	functions: 'Functions',
	authorization: 'Authorization',
	preInvocateScript: 'Pre-invocate script',
	tests: 'Tests',
	events: 'Events tracker',
};

const disabledTabs = ['tests'];

export type InvocationForm = {
	contractId?: string | null;
	selectedMethod?: string | null;
	parameters?: { id: string; key: string; value: string }[];
};

const InvocationPageContent = ({ data }: { data: Invocation }) => {
	const {
		handleLoadContract,
		isLoadingContract,
		contractResponses,
		handleRunInvocation,
		isRunningInvocation,
	} = useInvocation(data);

	const preInvocationValue = React.useMemo(() => {
		return data.preInvocation ?? '';
	}, [data]);

	const { setEditorValue } = useEditor(preInvocationValue);

	const isMissingKeys = React.useMemo(() => {
		return !data.publicKey || !data.secretKey;
	}, [data.publicKey, data.secretKey]);

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
				runInvocation={handleRunInvocation}
				loading={isLoadingContract || isRunningInvocation}
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

						if (tab === 'authorization' && isMissingKeys) {
							return (
								<Tooltip delayDuration={0}>
									<TooltipTrigger>
										<TabsTrigger
											key={tab}
											value={tab}
											disabled={disabledTabs.includes(tab)}
											data-test={`functions-tabs-${tab}`}
										>
											{tabs[tab]}
											<AlertCircle className="text-red-500 ml-2" size={16} />
										</TabsTrigger>
									</TooltipTrigger>
									<TooltipContent>
										<p>Missing keys</p>
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
				<TabsContent value="preInvocateScript" className="h-[500px]">
					<PreInvocateTab
						setEditorValue={setEditorValue}
						preInvocation={preInvocationValue}
					/>
				</TabsContent>
				<TabsContent value="events">
					<EventsTab />
				</TabsContent>
			</Tabs>
			<Terminal entries={contractResponses} />
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
