export type Invocation = {
	id: number;
	name: string;
	contractId?: string;
	functions?: string[];
	selectedFunction?: string | null;
	parameters?: { key: string; value: string }[] | null;
};
