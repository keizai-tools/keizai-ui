import NewEntityDialog from '../entity/newEntityDialog';
import { Button } from '../ui/button';

import { useNewCollectionMutation } from '@/common/api/collections';

function CollectionsEmptyState() {
	const { mutate, isPending } = useNewCollectionMutation();

	return (
		<div
			className="max-w-[450px] text-center flex flex-col items-center gap-8"
			data-test="collection-empty-state-container"
		>
			<img
				src="/blocks.svg"
				alt="Empty state"
				width={350}
				data-test="collection-empty-state-img"
			/>
			<h1
				className="text-xl text-primary"
				data-test="collection-empty-state-img-title"
			>
				Group related invocations in collections for quick access and smooth
				workflows.
			</h1>
			<NewEntityDialog
				title="New collection"
				description="Let's name your collection"
				defaultName="Collection"
				isLoading={isPending}
				onSubmit={({ name }) => {
					mutate({ name });
				}}
			>
				<Button data-test="collections-header-btn-new">
					Create a new collection
				</Button>
			</NewEntityDialog>
		</div>
	);
}

export default CollectionsEmptyState;
