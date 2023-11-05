import React from 'react';

import { useEditInvocationMutation } from '@/common/api/invocations';
import { useToast } from '@/common/components/ui/use-toast';

const useInvocation = ({ invocationId }: { invocationId: string }) => {
	const { toast } = useToast();
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

	return {
		handleLoadContract,
		isLoadingContract: isPending,
		handleSelectFunction,
	};
};

export default useInvocation;
