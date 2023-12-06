import React from 'react';

import {
	createContractResponsePreInvocation,
	createContractResponseTitle,
	handleAxiosError,
} from './invocation.utils';

import {
	useEditInvocationMutation,
	useRunInvocationQuery,
} from '@/common/api/invocations';
import { TerminalEntry } from '@/common/components/ui/Terminal';
import { useToast } from '@/common/components/ui/use-toast';
import { Invocation } from '@/common/types/invocation';

const useInvocation = (invocation: Invocation) => {
	const { toast } = useToast();
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

	const handleLoadContract = async (contractId: string) => {
		return await editInvocation({
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
			const preInvocationResponse = await handleRunPreInvocation(
				invocation.preInvocation ?? '',
			);
			const response = await runInvocation();
			if (response && response.method) {
				setContractResponses((prev) => [
					...prev,
					{
						isError: false,
						preInvocation: createContractResponsePreInvocation(
							preInvocationResponse,
						),
						title: createContractResponseTitle(response.method),
						message: response.response || 'No response',
					},
				]);
			} else {
				throw new Error();
			}
		} catch (error) {
			const errorResponse = handleAxiosError(error);
			setContractResponses((prev) => [...prev, errorResponse]);
		} finally {
			setIsRunningInvocation(false);
		}
	};

	const handleRunPreInvocation = (preInvocation: string) => {
		try {
			return eval(preInvocation);
		} catch (error) {
			return error;
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
