import React from 'react';
import { useNavigate } from 'react-router-dom';

import DeleteEntityDialog from '../Entity/DeleteEntityDialog';
import EditEntityDialog from '../Entity/EditEntityDialog';
import MoreOptions from '../Entity/MoreOptions';
import { Button } from '../ui/button';

import {
	useDeleteCollectionMutation,
	useUpdateCollectionMutation,
} from '@/common/api/collections';

const CollectionCard = ({ id, name }: { id: string; name: string }) => {
	const [activeDialog, setActiveDialog] = React.useState<
		'edit' | 'delete' | null
	>(null);
	const navigate = useNavigate();
	const { mutate: deleteCollectionMutation } = useDeleteCollectionMutation();
	const { mutate, isPending } = useUpdateCollectionMutation();

	const handleEditCollection = async ({ name }: { name: string }) => {
		await mutate({ id, name });
		setActiveDialog(null);
	};

	return (
		<div className="relative" data-test="collection-folder-container">
			<Button
				variant="ghost"
				className="p-6 flex justify-between items-start gap-4 border-solid border-2 rounded-lg border-primary h-[200px] w-[300px] font-bold"
				onClick={() => navigate(`/collection/${id}`)}
			>
				<span>{name}</span>
			</Button>
			<div className="absolute right-5 top-6 text-white">
				<MoreOptions
					onClickEdit={() => setActiveDialog('edit')}
					onClickDelete={() => setActiveDialog('delete')}
				/>
			</div>
			<DeleteEntityDialog
				open={activeDialog === 'delete'}
				onOpenChange={() => setActiveDialog(null)}
				title="Are you sure?"
				description="This will permanently delete your collection and all of its contents."
				onConfirm={() => deleteCollectionMutation(id)}
			/>
			<EditEntityDialog
				id={id}
				defaultName={name}
				open={activeDialog === 'edit'}
				onOpenChange={() => setActiveDialog(null)}
				title="Edit collection"
				description="Let's name your collection"
				onEdit={handleEditCollection}
				isLoading={isPending}
			/>
		</div>
	);
};

export default CollectionCard;
