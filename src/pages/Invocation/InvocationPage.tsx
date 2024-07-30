import { Loader } from 'lucide-react';
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Network, signTransaction } from 'simple-stellar-signer-api';

import useInvocation from './useInvocation';

import { useInvocationQuery } from '@/common/api/invocations';
import Breadcrumb from '@/common/components/Breadcrumb/Breadcrumb';
import ContractInput from '@/common/components/Input/ContractInput';
import TabsContainer from '@/common/components/Tabs/TabsContainer';
import Terminal from '@/common/components/ui/Terminal';
import { Invocation } from '@/common/types/invocation';
import { useAuth } from '@/services/auth/hook/useAuth';

export type InvocationForm = {
	contractId?: string | null;
	selectedMethod?: string | null;
	parameters?: { id: string; key: string; value: string }[];
};

const InvocationPageContent = ({ data }: { data: Invocation }) => {
	const [signedXDR, setSignedXDR] = React.useState('');
	const { wallet } = useAuth();

	const {
		handleLoadContract,
		isLoadingContract,
		contractResponses,
		handleRunInvocation,
		isRunningInvocation,
		handlePrepareInvocation,
		transactionXDR,
		isPreparingInvocation,
	} = useInvocation(data, signedXDR);

	const preInvocationValue = React.useMemo(() => {
		return data.preInvocation ?? '';
	}, [data]);

	const postInvocationValue = React.useMemo(() => {
		return data.postInvocation ?? '';
	}, [data]);

	const isMissingKeys = React.useMemo(() => {
		if (wallet?.publicKey) {
			return false;
		}
		return !data.publicKey || !data.secretKey;
	}, [wallet, data.publicKey, data.secretKey]);

	React.useEffect(() => {
		(async () => {
			if (transactionXDR && data.network) {
				const signedTransaction = await signTransaction(
					transactionXDR,
					data.network.toLowerCase() as Network,
				);
				setSignedXDR(signedTransaction);
			}
		})();
	}, [transactionXDR, data.network]);

	React.useEffect(() => {
		if (!wallet?.publicKey) {
			setSignedXDR('');
		}
	}, [wallet?.publicKey]);

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
				loading={
					isLoadingContract || isRunningInvocation || isPreparingInvocation
				}
				prepareInvocation={handlePrepareInvocation}
				signedXDR={signedXDR}
				walletPublicKey={wallet?.publicKey || ''}
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
