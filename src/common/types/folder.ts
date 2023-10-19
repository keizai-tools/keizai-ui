import { Invocation } from './invocation';

export type Folder = {
	id: string;
	name: string;
	invocations: Invocation[];
};
