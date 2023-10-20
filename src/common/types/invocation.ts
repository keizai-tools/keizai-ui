export type Invocation = {
	id: string;
	name: string;
	contractId?: string;
	folderId?: string;
	functions?: string[];
	selectedFunction?: string | null;
	parameters?: { key: string; value: string }[] | null;
};
