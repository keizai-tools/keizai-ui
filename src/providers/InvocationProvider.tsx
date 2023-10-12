/* eslint-disable @typescript-eslint/no-empty-function */
import React, { ReactNode, createContext } from 'react';

export type Invocation = {
	id: number;
	contractId?: string;
	functions?: string[];
	selectedFunction?: string | null;
	parameters?: { key: string; value: string }[] | null;
};

interface InvocationContextProps {
	selectedInvocation: Invocation | null;
	loadContractToInvocation: (contractId: string) => void;
	createInvocation: () => void;
	deleteInvocation: () => void;
	selectInvocation: (invocationId: number) => void;
}

const defaultInvocationContext = {
	selectedInvocation: null,
	loadContractToInvocation: () => {},
	createInvocation: () => {},
	deleteInvocation: () => {},
	selectInvocation: () => {},
};

export const InvocationContext = createContext<InvocationContextProps>(
	defaultInvocationContext,
);

interface InvocationProviderProps {
	children: ReactNode;
}

export const InvocationProvider = ({ children }: InvocationProviderProps) => {
	const [invocationData, setInvocationData] = React.useState<Invocation | null>(
		null,
	);

	// TODO Remove this useEffect once selection of invocation is enabled
	React.useEffect(() => {
		selectInvocation(0);
	}, []);

	const selectInvocation = (invocationId: number) => {
		// TODO Implement API call to get invocation data and select invocation
		setInvocationData({
			...invocationData,
			id: invocationId,
		});
	};

	const createInvocation = () => {
		// TODO Implement API call to create new invocation and select it
		setInvocationData({
			...invocationData,
			id: 0,
		});
	};

	const deleteInvocation = () => {
		// TODO Implement API call to delete invocation and select other existing invocation
		setInvocationData(null);
	};

	const loadContractToInvocation = (contractId: string) => {
		if (!invocationData) return;

		// TODO Implement API call to assign contract to an invocation
		setInvocationData({
			...invocationData,
			contractId,
			functions: ['increment', 'decrement', 'get_current_value'],
		});
	};

	return (
		<InvocationContext.Provider
			value={{
				selectedInvocation: invocationData,
				loadContractToInvocation,
				selectInvocation,
				createInvocation,
				deleteInvocation,
			}}
		>
			{children}
		</InvocationContext.Provider>
	);
};
