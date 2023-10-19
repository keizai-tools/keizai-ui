import { ListPlusIcon } from 'lucide-react';

import { Button } from '../ui/button';
import NewCollectionDialog from './NewCollectionDialog';

const CollectionPlaceholder = () => {
	return (
		<NewCollectionDialog>
			<Button
				variant="ghost"
				className="flex flex-col gap-4 border-dashed border-2 border-primary rounded-lg h-[200px] w-[300px] font-bold"
				data-test="collections-header-btn-new"
			>
				<ListPlusIcon size={42} />
				Create a new collection
			</Button>
		</NewCollectionDialog>
	);
};

export default CollectionPlaceholder;
