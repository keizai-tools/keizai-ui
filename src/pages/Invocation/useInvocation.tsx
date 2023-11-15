import React from 'react';

import {
	createContractResponseTitle,
	handleAxiosError,
} from './invocation.utils';

import {
	useEditInvocationMutation,
	useRunInvocationQuery,
} from '@/common/api/invocations';
import { TerminalEntry } from '@/common/components/ui/Terminal';
import { useToast } from '@/common/components/ui/use-toast';

const useInvocation = ({ invocationId }: { invocationId: string }) => {
	const { toast } = useToast();
	const runInvocation = useRunInvocationQuery({ id: invocationId });
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
			id: invocationId,
			contractId,
		});
	};

	const handleSelectFunction = (methodId: string) => {
		editInvocation({
			id: invocationId,
			selectedMethodId: methodId,
		});
	};

	const handleRunInvocation = async () => {
		setIsRunningInvocation(true);
		try {
			const response = await runInvocation();
			if (response && response.method) {
				setContractResponses((prev) => [
					...prev,
					{
						isError: false,
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
