import { ReactNode, createContext, useState } from 'react';

export type Invocation = {
	id: string;
	name: string;
	contractAddress: string;
};

interface InvocationContextProps {
	selectedInvocation: Invocation | null;
	setSelectedInvocation: (invocation: Invocation) => void;
}

export const InvocationContext = createContext<
	InvocationContextProps | undefined
>(undefined);

interface InvocationProviderProps {
	children: ReactNode;
}

export const InvocationProvider = ({ children }: InvocationProviderProps) => {
	const [selectedInvocation, setSelectedInvocation] =
		useState<Invocation | null>(null);

	return (
		<InvocationContext.Provider
			value={{ selectedInvocation, setSelectedInvocation }}
		>
			{children}
		</InvocationContext.Provider>
	);
};
