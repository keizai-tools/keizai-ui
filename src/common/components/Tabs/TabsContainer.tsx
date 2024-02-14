import { AlertCircle } from 'lucide-react';
import React from 'react';

import AuthorizationTab from './AuthorizationTab/AuthorizationTab';
import EventsTab from './EventsTab/EventsTab';
import FunctionsTab from './FunctionsTab/FunctionsTab';
import PreInvocationTab from './PreInvocationTab/PreInvocationTab';
import TestsTab from './TestsTab/TestsTab';

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

type TabsProps = {
	data: Invocation;
	preInvocationValue: string;
	postInvocationValue: string;
	isMissingKeys: boolean;
};

function TabsContainer({
	data,
	preInvocationValue,
	postInvocationValue,
	isMissingKeys,
}: TabsProps) {
	const [selectedTab, setSelectedTab] = React.useState<string>('');
	const { setPreInvocationValue, setPostInvocationValue } = useEditor(
		preInvocationValue,
		postInvocationValue,
	);

	const handleTabClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		const target = e.target as HTMLButtonElement;
		setSelectedTab(target.innerText);
	};

	return (
		<Tabs
			defaultValue="functions"
			className="flex-1"
			data-test="tabs-container"
		>
			<TabsList className="" data-test="tabs-list-container">
				{Object.keys(tabs).map((tab) => {
					if (tab === 'authorization' && isMissingKeys) {
						return (
							<Tooltip delayDuration={0} key={tab}>
								<TooltipTrigger asChild>
									<TabsTrigger
										value={tab}
										className={`${
											selectedTab === tabs[tab]
												? 'text-slate-950 shadow-sm dark:ring-offset-slate-950 dark:bg-slate-950 dark:text-slate-50'
												: ''
										}`}
										onClick={handleTabClick}
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
							onClick={handleTabClick}
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
					network={data.network}
					defaultValues={{
						secretKey: data.secretKey,
						publicKey: data.publicKey,
					}}
				/>
			</TabsContent>
			<TabsContent value="preInvocateScript" className="h-[500px]">
				<PreInvocationTab
					preInvocationValue={preInvocationValue}
					setPreInvocationValu={setPreInvocationValue}
				/>
			</TabsContent>
			<TabsContent value="tests" className="h-[500px]">
				<TestsTab
					testsInvocationValue={postInvocationValue}
					setTestsInvocationValue={setPostInvocationValue}
				/>
			</TabsContent>
			<TabsContent value="events">
				<EventsTab />
			</TabsContent>
		</Tabs>
	);
}

export default TabsContainer;
