import { v4 as uuidv4 } from 'uuid';

export function generateUniqueID(): string {
	return uuidv4();
}
