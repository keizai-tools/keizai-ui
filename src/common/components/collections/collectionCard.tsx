import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import DeleteEntityDialog from '../entity/deleteEntityDialog';
import EditEntityDialog from '../entity/editEntityDialog';
import MoreOptions from '../entity/moreOptions';
import { Button } from '../ui/button';

import {
	useDeleteCollectionMutation,
	useUpdateCollectionMutation,
} from '@/common/api/collections';

function CollectionCard({
	id,
	name,
	foldersCount = 0,
	invocationsCount = 0,
}: Readonly<{
	id: string;
	name: string;
	foldersCount?: number;
	invocationsCount?: number;
}>) {
	const [activeDialog, setActiveDialog] = useState<'edit' | 'delete' | null>(
		null,
	);
	const navigate = useNavigate();
	const { mutate: deleteCollectionMutation } = useDeleteCollectionMutation();
	const { mutate, isPending } = useUpdateCollectionMutation();

	function handleEditCollection({ name }: { name: string }) {
		mutate({ id, name });
		window.umami.track('Edit collection');
		setActiveDialog(null);
	}

	const textFolder = foldersCount === 1 ? 'Folder' : 'Folders';

	return (
		<div className="relative" data-test="collection-folder-container">
			<Button
				variant="ghost"
				className="p-6 flex flex-col justify-between items-start gap-4 border-solid border-2 rounded-lg border-primary h-[200px] w-[300px] font-bold"
				data-test="collection-folder-btn"
				onClick={() => navigate(`/collection/${id}`)}
			>
				<span data-test="collection-folder-title">{name}</span>
				<div className="flex flex-col items-start justify-start">
					<span
						className="font-medium text-slate-400"
						data-test="collection-folder-quantity"
					>
						{foldersCount === 0
							? 'No folders'
							: `${foldersCount} ${textFolder}`}
					</span>
					{foldersCount > 0 && (
						<span className="font-medium text-slate-400">
							{invocationsCount === 0 ? 'No' : invocationsCount}{' '}
							{invocationsCount === 1 ? 'Invocation' : 'Invocations'}
						</span>
					)}
				</div>
			</Button>
			<div className="absolute text-white right-5 top-6">
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
}

export default CollectionCard;
