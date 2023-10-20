export type Invocation = {
	id: string;
	name: string;
	contractId?: string;
	folder?: {
		id: string;
		name: string;
	};
	methods?: {
		id: string;
		name: string;
		value: string;
	}[];
	selectedMethod?: string | null;
	parameters?: { key: string; value: string }[] | null;
};
