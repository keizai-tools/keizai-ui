import { useEditInvocationMutation } from '@/common/api/invocations';

const useInvocation = ({ invocationId }: { invocationId: string }) => {
	const { mutate: editInvocation, isPending } = useEditInvocationMutation();

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
