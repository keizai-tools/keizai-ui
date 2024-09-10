import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
	getInvocationResponse,
	handleAxiosError,
} from '../utils/invocation.utils';

import {
	useEditInvocationMutation,
	useRunInvocationQuery,
	usePrepareInvocationQuery,
} from '@/common/api/invocations';
import { TerminalEntry } from '@/common/components/ui/Terminal';
import { useToast } from '@/common/components/ui/use-toast';
import useContractEvents from '@/common/hooks/useContractEvents';
import { Invocation } from '@/common/types/invocation';
import { BACKEND_NETWORK, NETWORK } from '@/common/types/soroban.enum';
import { IWallet } from '@/modules/auth/interfaces/IAuthenticationContext';
import { InvocationService } from '@/modules/invocation/services/invocation.service';
import signTransaction from '@/modules/signer/functions/signTransaction';

function useInvocation(
	invocation: Invocation,
	wallet: IWallet,
	connectWallet: (network: Partial<NETWORK>) => Promise<void>,
) {
	const { toast } = useToast();
	const { collectionId } = useParams();
	const runInvocation = useRunInvocationQuery({
		id: invocation.id,
	});
	const prepareInvocation = usePrepareInvocationQuery({
		id: invocation.id,
	});
	const [isRunningInvocation, setIsRunningInvocation] = useState(false);
	const [contractResponses, setContractResponses] = useState<TerminalEntry[]>(
		[],
	);
	const { handleSetContractEvents } = useContractEvents();
	const {
		mutate: editInvocation,
		isPending,
		status,
	} = useEditInvocationMutation();

	useEffect(() => {
		if (status === 'error') {
			toast({
				title: "Couldn't load contract",
				description: 'Please check the contract address',
				variant: 'destructive',
			});
		}
	}, [status, toast]);

	const Keizai = useMemo(() => {
		return new InvocationService(collectionId ?? '');
	}, [collectionId]);

	const runKeizaiService = useCallback(
		async (serviceToRun: string, invocation?: string) => {
			if (invocation) Keizai.invocationResponse = invocation;

			const contextFunction = new Function(
				'Keizai',
				`return (async () => { ${serviceToRun} })();`,
			).bind(null, Keizai);

			return contextFunction();
		},
		[Keizai],
	);

	const handleRunService = useCallback(
		async (title: string, serviceToRun: string, invocation?: string) => {
			try {
				return {
					isError: false,
					message: String(serviceToRun),
					title,
					serviceResponse: await runKeizaiService(serviceToRun, invocation),
				};
			} catch (error) {
				return {
					isError: true,
					message: String(`${error} from Pre-invocation script`),
					title: `${title} Error`,
					serviceToRun: String(serviceToRun),
				};
			}
		},
		[runKeizaiService],
	);

	function handleLoadContract(contractId: string) {
		return editInvocation({
			id: invocation.id,
			contractId,
		});
	}

	function handleSelectFunction(methodId: string) {
		editInvocation({
			id: invocation.id,
			selectedMethodId: methodId,
		});
	}

	const handleRunInvocation = useCallback(async (): Promise<void> => {
		setIsRunningInvocation(true);
		try {
			let signedTransaction: string | null = null;
			if (
				invocation.network === BACKEND_NETWORK.SOROBAN_MAINNET &&
				!wallet[NETWORK.SOROBAN_MAINNET]
			) {
				connectWallet(NETWORK.SOROBAN_MAINNET);
			}
			if (!wallet[invocation.network as keyof typeof wallet]?.autoGenerated) {
				const invocationTransactionXDR = await prepareInvocation();

				if (typeof invocationTransactionXDR !== 'string') {
					setContractResponses((prev) => [
						...prev,
						{
							isError: true,
							message: invocationTransactionXDR.message,
							title: 'Transaction Error',
							serviceToRun: invocationTransactionXDR.response,
						},
					]);
					setIsRunningInvocation(false);
					return;
				}
				signedTransaction = await signTransaction(
					invocationTransactionXDR,
					invocation.network as unknown as NETWORK,
				);
			}
			const preInvocationResponse = await handleRunService(
				'Pre-Invocation',
				invocation.preInvocation ?? '',
			);
			if (preInvocationResponse.isError) {
				setContractResponses((prev) => [...prev, preInvocationResponse]);
			} else {
				const response = await runInvocation(signedTransaction);

				const postInvocationResponse = await handleRunService(
					'Post-Invocation',
					invocation.postInvocation ?? '',
					response?.response,
				);

				if (postInvocationResponse.isError) {
					setContractResponses((prev) => [...prev, postInvocationResponse]);
				}

				const invocationResponse = getInvocationResponse(
					response,
					preInvocationResponse?.serviceResponse,
					postInvocationResponse?.serviceResponse,
				);
				setContractResponses((prev) => [...prev, invocationResponse]);
				if (response.events) {
					handleSetContractEvents(response.events);
				}
			}
		} catch (error) {
			const errorResponse = handleAxiosError(error);
			setContractResponses((prev) => [...prev, errorResponse]);
		} finally {
			setIsRunningInvocation(false);
		}
	}, [
		connectWallet,
		handleRunService,
		handleSetContractEvents,
		invocation.network,
		invocation.postInvocation,
		invocation.preInvocation,
		prepareInvocation,
		runInvocation,
		wallet,
	]);

	return {
		handleLoadContract,
		isLoadingContract: isPending,
		handleSelectFunction,
		contractResponses,
		handleRunInvocation,
		isRunningInvocation,
	};
}

export default useInvocation;
