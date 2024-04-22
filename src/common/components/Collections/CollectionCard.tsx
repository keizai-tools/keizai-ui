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

const CollectionCard = ({
	id,
	name,
	endpoint,
	foldersCount = 0,
	invocationsCount = 0,
}: {
	id: string;
	name: string;
	endpoint: string;
	foldersCount?: number;
	invocationsCount?: number;
}) => {
	const [activeDialog, setActiveDialog] = React.useState<
		'edit' | 'delete' | null
	>(null);
	const navigate = useNavigate();
	const { mutate: deleteCollectionMutation } = useDeleteCollectionMutation();
	const { mutate, isPending } = useUpdateCollectionMutation();

	const handleEditCollection = async ({ name }: { name: string }) => {
		await mutate({ id, name });
		window.umami.track('Edit collection');
		setActiveDialog(null);
	};

	return (
		<div className="relative" data-test="collection-folder-container">
			<Button
				variant="ghost"
				className="p-6 flex flex-col justify-between items-start gap-4 border-solid border-2 rounded-lg border-primary h-[200px] w-[300px] font-bold"
				data-test="collection-folder-btn"
				onClick={() => navigate(`${endpoint}/collection/${id}`)}
			>
				<span data-test="collection-folder-title">{name}</span>
				<div className="flex flex-col justify-start items-start">
					<span
						className="text-slate-400 font-medium"
						data-test="collection-folder-quantity"
					>
						{foldersCount === 0
							? 'No folders'
							: `${foldersCount} ${foldersCount === 1 ? 'Folder' : 'Folders'}`}
					</span>
					{foldersCount > 0 && (
						<span className="text-slate-400 font-medium">
							{invocationsCount === 0 ? 'No' : invocationsCount}{' '}
							{invocationsCount === 1 ? 'Invocation' : 'Invocations'}
						</span>
					)}
				</div>
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
				onConfirm={() => {
					deleteCollectionMutation(id);
					window.umami.track('Delete collection');
				}}
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
