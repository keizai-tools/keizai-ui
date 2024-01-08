export const customKeizaiToPreInvocationEditor = `declare const Keizai: {
	setEnvironmentVariable: (name: string, value: string) => void;
	clearEnvironmentVariable: (name: string) => void;
	clearAllEnvironmentVariables: () => void;
	getCollectionVariableValue: (name: string) => Promise<string>;
};`;

export const customKeizaiToTests = `declare const Keizai: {
	setEnvironmentVariable: (name: string, value: string) => void;
	clearEnvironmentVariable: (name: string) => void;
	clearAllEnvironmentVariables: () => void;
	getCollectionVariableValue: (name: string) => Promise<string>;
	getInvocationResponse: () => string;
};`;
