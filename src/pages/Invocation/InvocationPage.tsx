import { Loader } from 'lucide-react';
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

import useInvocation from './useInvocation';

import { useInvocationQuery } from '@/common/api/invocations';
import Breadcrumb from '@/common/components/Breadcrumb/Breadcrumb';
import ContractInput from '@/common/components/Input/ContractInput';
import TabsContainer from '@/common/components/Tabs/TabsContainer';
import Terminal from '@/common/components/ui/Terminal';
import { Invocation } from '@/common/types/invocation';

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

	const postInvocationValue = React.useMemo(() => {
		return data.postInvocation ?? '';
	}, [data]);

	const isMissingKeys = React.useMemo(() => {
		return !data.publicKey || !data.secretKey;
	}, [data.publicKey, data.secretKey]);

	return (
		<div
			className="relative flex flex-col p-3 w-full gap-4 max-h-screen overflow-hidden"
			data-test="invocation-section-container"
		>
			<Breadcrumb
				contractName="Collection"
				folderName={data.folder?.name || ''}
				contractInvocationName={data.name}
			/>
			<ContractInput
				defaultValue={data.contractId || ''}
				defaultNetwork={data.network}
				loadContract={handleLoadContract}
				runInvocation={handleRunInvocation}
				loading={isLoadingContract || isRunningInvocation}
			/>
			<TabsContainer
				data={data}
				preInvocationValue={preInvocationValue}
				postInvocationValue={postInvocationValue}
				isMissingKeys={isMissingKeys}
			/>
			<Terminal entries={contractResponses} />
		</div>
	);
};

const InvocationPage = () => {
	const { invocationId, teamId } = useParams();
	const { data, isLoading, isRefetching, error } = useInvocationQuery({
		id: invocationId,
		teamId,
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
