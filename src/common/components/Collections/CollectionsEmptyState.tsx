import NewEntityDialog from '../Entity/NewEntityDialog';
import { Button } from '../ui/button';

import { useNewCollectionMutation } from '@/common/api/collections';

const CollectionsEmptyState = () => {
	const { mutate, isPending } = useNewCollectionMutation();

	return (
		<div className="max-w-[450px] text-center flex flex-col items-center gap-8">
			<img src="/blocks.svg" alt="Empty state" width={350} />
			<h1 className="text-xl text-primary">
				Group related invocations in collections for quick access and smooth
				workflows.
			</h1>
			<NewEntityDialog
				title="New collection"
				description="Let's name your collection"
				defaultName="Collection"
				isLoading={isPending}
				onSubmit={async ({ name }) => {
					await mutate({ name });
				}}
			>
				<Button>Create a new collection</Button>
			</NewEntityDialog>
		</div>
	);
};

export default CollectionsEmptyState;
