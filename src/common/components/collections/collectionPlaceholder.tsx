import { ListPlusIcon } from 'lucide-react';

import NewEntityDialog from '../entity/newEntityDialog';
import { Button } from '../ui/button';

import { useNewCollectionMutation } from '@/common/api/collections';

function CollectionPlaceholder() {
	const { mutate, isPending } = useNewCollectionMutation();

	return (
		<NewEntityDialog
			title="New collection"
			description="Let's name your collection"
			defaultName="Collection"
			isLoading={isPending}
			onSubmit={({ name }) => {
				mutate({ name });
				if (window.umami) window?.umami?.track('Create collection');
			}}
		>
			<Button
				variant="ghost"
				className="flex flex-col gap-4 border-dashed border-2 border-primary rounded-lg h-[200px] w-[300px] font-bold"
				data-test="collections-header-btn-new"
			>
				<ListPlusIcon size={42} />
				Create a new collection
			</Button>
		</NewEntityDialog>
	);
}

export default CollectionPlaceholder;
