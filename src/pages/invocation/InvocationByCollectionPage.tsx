import React, { useEffect, useState } from 'react';

import { useEditInvocationKeysMutation } from '@/common/api/invocations';
import Breadcrumb from '@/common/components/Breadcrumb/Breadcrumb';
import ContractInput from '@/common/components/Input/ContractInput';
import TabsContainer from '@/common/components/Tabs/TabsContainer';
import Terminal from '@/common/components/ui/Terminal';
import { Invocation } from '@/common/types/invocation';
import { useAuthProvider } from '@/modules/auth/hooks/useAuthProvider';
import useInvocation from '@/modules/invocation/hooks/useInvocation';

function InvocationByCollectionPage({
	invocation,
}: {
	invocation: Invocation;
}) {
	return <InvocationPageContent invocation={invocation} />;
}

export default InvocationByCollectionPage;

function InvocationPageContent({
	invocation,
}: Readonly<{ invocation: Invocation }>) {
	const { mutate: editKeys } = useEditInvocationKeysMutation();
	const [isTerminalVisible, setIsTerminalVisible] = useState(true);

	const { wallet, statusState, connectWallet } = useAuthProvider();

	useEffect(() => {
		if (wallet[invocation.network as keyof typeof wallet]) {
			editKeys({
				id: invocation.id,
				publicKey:
					wallet[invocation.network as keyof typeof wallet]?.publicKey ?? '',
				secretKey:
					wallet[invocation.network as keyof typeof wallet]?.privateKey ?? '',
			});
		}
	}, [invocation.id, invocation.network, editKeys, wallet]);

	const {
		handleLoadContract,
		isLoadingContract,
		contractResponses,
		handleRunInvocation,
		isRunningInvocation,
	} = useInvocation(invocation, wallet, connectWallet);

	const preInvocationValue = React.useMemo(() => {
		return invocation.preInvocation ?? '';
	}, [invocation]);

	const postInvocationValue = React.useMemo(() => {
		return invocation.postInvocation ?? '';
	}, [invocation]);

	function toggleTerminalVisibility(event: KeyboardEvent) {
		if (event.ctrlKey && event.key === 'j') {
			event.preventDefault();
			setIsTerminalVisible((prev) => !prev);
		}
	}

	useEffect(() => {
		window.addEventListener('keydown', toggleTerminalVisibility);

		return () => {
			window.removeEventListener('keydown', toggleTerminalVisibility);
		};
	}, []);

	return (
		<div
			className="relative flex flex-col w-full max-h-screen gap-4 p-3 overflow-hidden"
			data-test="invocation-section-container"
		>
			<Breadcrumb
				contractName="Collection"
				folderName={invocation.folder?.name ?? ''}
				contractInvocationName={invocation.name}
			/>
			<ContractInput
				defaultValue={invocation.contractId ?? ''}
				defaultNetwork={invocation.network}
				loadContract={handleLoadContract}
				runInvocation={handleRunInvocation}
				method={invocation.selectedMethod}
				loading={
					isLoadingContract || isRunningInvocation || statusState.wallet.loading
				}
			/>
			{invocation.contractId && (
				<div
					className="flex flex-col w-full h-full gap-2 overflow-hidden"
					data-test="tabs-terminal-container "
				>
					<TabsContainer
						data={invocation}
						preInvocationValue={preInvocationValue}
						postInvocationValue={postInvocationValue}
						setIsTerminalVisible={setIsTerminalVisible}
					/>
					{isTerminalVisible && (
						<div className="flex-grow p-10">
							<Terminal entries={contractResponses} />{' '}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
