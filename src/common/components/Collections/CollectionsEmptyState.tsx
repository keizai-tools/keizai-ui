import { Button } from '../ui/button';
import NewCollectionDialog from './NewCollectionDialog';

const CollectionsEmptyState = () => {
	return (
		<div className="max-w-[450px] text-center flex flex-col items-center gap-8">
			<img src="/blocks.svg" alt="Empty state" width={350} />
			<h1 className="text-xl text-primary">
				Group related invocations in collections for quick access and smooth
				workflows.
			</h1>
			<NewCollectionDialog>
				<Button>Create a new collection</Button>
			</NewCollectionDialog>
		</div>
	);
};

export default CollectionsEmptyState;
