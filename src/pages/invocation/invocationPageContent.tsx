import React, { useEffect, Fragment } from 'react';

import { useEditInvocationKeysMutation } from '@/common/api/invocations';
import Breadcrumb from '@/common/components/Breadcrumb/Breadcrumb';
import ContractInput from '@/common/components/Input/ContractInput';
import TabsContainer from '@/common/components/Tabs/TabsContainer';
import Terminal from '@/common/components/ui/Terminal';
import { Invocation } from '@/common/types/invocation';
import { useAuthProvider } from '@/modules/auth/hooks/useAuthProvider';
import useInvocation from '@/modules/invocation/hooks/useInvocation';

export default function InvocationPageContent({
	data,
}: Readonly<{ data: Invocation }>) {
	const { mutate: editKeys } = useEditInvocationKeysMutation();

	const { wallet, statusState } = useAuthProvider();
	const publickey = wallet[data.network as keyof typeof wallet]?.publicKey;

	useEffect(() => {
		if (wallet) {
			editKeys({
				id: data.id,
				publicKey: wallet[data.network as keyof typeof wallet]?.publicKey || '',
				secretKey:
					wallet[data.network as keyof typeof wallet]?.privateKey || '',
			});
		}
	}, [data.id, data.network, editKeys, wallet]);

	const {
		handleLoadContract,
		isLoadingContract,
		contractResponses,
		handleRunInvocation,
		isRunningInvocation,
	} = useInvocation(data, wallet);

	const preInvocationValue = React.useMemo(() => {
		return data.preInvocation ?? '';
	}, [data]);

	const postInvocationValue = React.useMemo(() => {
		return data.postInvocation ?? '';
	}, [data]);

	const isMissingKeys = React.useMemo(() => {
		if (publickey) {
			return false;
		}
		return !data.publicKey || !data.secretKey;
	}, [publickey, data.publicKey, data.secretKey]);

	return (
		<div
			className="relative flex flex-col w-full max-h-screen gap-4 p-3 overflow-hidden"
			data-test="invocation-section-container"
		>
			<Breadcrumb
				contractName="Collection"
				folderName={data.folder?.name ?? ''}
				contractInvocationName={data.name}
			/>
			<ContractInput
				defaultValue={data.contractId ?? ''}
				defaultNetwork={data.network}
				loadContract={handleLoadContract}
				runInvocation={handleRunInvocation}
				method={data.selectedMethod}
				loading={
					isLoadingContract || isRunningInvocation || statusState.wallet.loading
				}
			/>
			{data.contractId && (
				<Fragment>
					<TabsContainer
						data={data}
						preInvocationValue={preInvocationValue}
						postInvocationValue={postInvocationValue}
						isMissingKeys={isMissingKeys}
					/>
					<Terminal entries={contractResponses} />
				</Fragment>
			)}
		</div>
	);
}
