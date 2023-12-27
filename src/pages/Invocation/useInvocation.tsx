/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useParams } from 'react-router-dom';

import {
	createContractResponse,
	createContractResponseTitle,
	handleAxiosError,
} from './invocation.utils';
import { KeizaiService } from './preInvocation/keizai/keizai.service';

import {
	useEditInvocationMutation,
	useRunInvocationQuery,
} from '@/common/api/invocations';
import { TerminalEntry } from '@/common/components/ui/Terminal';
import { useToast } from '@/common/components/ui/use-toast';
import { Invocation } from '@/common/types/invocation';
import { useAuth } from '@/services/auth/hook/useAuth';

const useInvocation = (invocation: Invocation) => {
	const { toast } = useToast();
	const { user } = useAuth();
	const { collectionId } = useParams();
	const runInvocation = useRunInvocationQuery({ id: invocation.id });
	const [isRunningInvocation, setIsRunningInvocation] = React.useState(false);
	const [contractResponses, setContractResponses] = React.useState<
		TerminalEntry[]
	>([]);
	const {
		mutate: editInvocation,
		isPending,
		status,
	} = useEditInvocationMutation();

	React.useEffect(() => {
		if (status === 'error') {
			toast({
				title: "Couldn't load contract",
				description: 'Please check the contract address',
				variant: 'destructive',
			});
		}
	}, [status, toast]);

	const Keizai = React.useMemo(() => {
		return new KeizaiService(
			user?.accessToken ?? '',
			collectionId ?? '',
			import.meta.env.VITE_URL_API_BASE,
		);
	}, [user?.accessToken, collectionId]);

	const runKeizaiService = async (
		serviceToRun: string,
		invocation?: string,
	) => {
		if (invocation) Keizai.invocationResponse = invocation;
		const contextFunction = async function () {
			return await eval(`(async () => { ${serviceToRun} })()`);
		}.bind({ Keizai });

		return contextFunction();
	};
	const handleRunService = async (
		serviceToRun: string,
		invocation?: string,
	) => {
		try {
			return {
				isError: false,
				message: String(serviceToRun),
				title: 'Pre-Invocation',
				serviceResponse: await runKeizaiService(serviceToRun, invocation),
			};
		} catch (error) {
			return {
				isError: true,
				message: String(`${error} from Pre-invocation script`),
				title: 'Pre-Invocation error',
				serviceToRun: String(serviceToRun),
			};
		}
	};

	const handleLoadContract = (contractId: string) => {
		return editInvocation({
			id: invocation.id,
			contractId,
		});
	};

	const handleSelectFunction = (methodId: string) => {
		editInvocation({
			id: invocation.id,
			selectedMethodId: methodId,
		});
	};

	const handleRunInvocation = async () => {
		setIsRunningInvocation(true);
		try {
			const preInvocationResponse = await handleRunService(
				invocation.preInvocation ?? '',
			);
			if (preInvocationResponse.isError) {
				setContractResponses((prev) => [...prev, preInvocationResponse]);
			} else {
				const response = await runInvocation();
				const postInvocationResponse = await handleRunService(
					invocation.postInvocation ?? '',
					response?.response,
				);
				if (response && response.method) {
					setContractResponses((prev) => [
						...prev,
						{
							isError: false,
							preInvocation: createContractResponse(
								preInvocationResponse?.serviceResponse,
							),
							postInvocation: createContractResponse(
								postInvocationResponse?.serviceResponse,
							),
							title: createContractResponseTitle(response.method),
							message: response.response || 'No response',
						},
					]);
				} else {
					throw new Error();
				}
			}
		} catch (error) {
			const errorResponse = handleAxiosError(error);
			setContractResponses((prev) => [...prev, errorResponse]);
		} finally {
			setIsRunningInvocation(false);
		}
	};

	return {
		handleLoadContract,
		isLoadingContract: isPending,
		handleSelectFunction,
		contractResponses,
		handleRunInvocation,
		isRunningInvocation,
	};
};

export default useInvocation;
