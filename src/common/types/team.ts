import { Collection } from './collection';
import { User } from './user';

export type Team = {
	id: string;
	name: string;
	adminId: string;
	users: User[];
	collections: Collection[];
};
