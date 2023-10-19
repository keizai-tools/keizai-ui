import { Folder } from './folder';

export type Collection = {
	id: string;
	name: string;
	folders: Folder[];
};
