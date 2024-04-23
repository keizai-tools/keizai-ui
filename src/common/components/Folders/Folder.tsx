import { GanttChart } from 'lucide-react';
import React from 'react';
import { useParams } from 'react-router-dom';

import DeleteEntityDialog from '../Entity/DeleteEntityDialog';
import EditEntityDialog from '../Entity/EditEntityDialog';
import MoreOptions from '../Entity/MoreOptions';
import InvocationListItem from '../Invocations/InvocationListItem';
import NewInvocationButton from '../Invocations/NewInvocationButton';

import {
	useDeleteFolderMutation,
	useEditFolderMutation,
} from '@/common/api/folders';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/common/components/ui/accordion';
import { Folder as IFolder } from '@/common/types/folder';

const Folder = ({ folder }: { folder: IFolder }) => {
	const { collectionId, teamId, invocationId } = useParams();
	const [isOpen, setIsOpen] = React.useState<string[] | undefined>();
	const [openDialog, setOpenDialog] = React.useState<'edit' | 'delete' | null>(
		null,
	);
	const { mutate: deleteFolderMutation } = useDeleteFolderMutation({
		collectionId,
		teamId,
	});
	const { mutate: editFolderMutation, isPending: isEditingFolder } =
		useEditFolderMutation({ collectionId, teamId });

	React.useLayoutEffect(() => {
		if (invocationId && folder) {
			const folderHasInvocation = folder.invocations?.find(
				(invocation) => invocation.id === invocationId,
			);

			if (folderHasInvocation) {
				setIsOpen([folder.id]);
			}
		}
	}, [folder, invocationId]);

	return (
		<>
			<Accordion
				type="multiple"
				className="w-full"
				value={isOpen}
				onValueChange={() => {
					if (isOpen?.includes(folder.id)) {
						setIsOpen(isOpen?.filter((id) => id !== folder.id));
					} else {
						setIsOpen(isOpen ? [...isOpen, folder.id] : [folder.id]);
					}
				}}
			>
				<AccordionItem value={folder.id} className="border-none">
					<AccordionTrigger
						className="h-10 w-full "
						data-test="collection-folder-container"
					>
						<div className="flex justify-between items-center w-full text-slate-100 text-sm">
							<div
								className="flex gap-1 items-center"
								data-test="folder-accordion-title"
							>
								<GanttChart size={16} />
								<span data-test="collection-folder-name">{folder.name}</span>
							</div>
							<div>
								<MoreOptions
									onClickDelete={(e) => {
										e.stopPropagation();
										setOpenDialog('delete');
									}}
									onClickEdit={(e) => {
										e.stopPropagation();
										setOpenDialog('edit');
									}}
								/>
							</div>
						</div>
					</AccordionTrigger>
					<AccordionContent>
						<div
							className="flex flex-col justify-start text-slate-100"
							data-test="collection-folder-invocation-list"
						>
							{folder.invocations?.map((invocation) => (
								<InvocationListItem
									key={invocation.id}
									invocation={invocation}
								/>
							))}
							<div
								className="ml-4"
								data-test="collection-folder-new-invocation-btn"
							>
								<NewInvocationButton folderId={folder.id} />
							</div>
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
			<DeleteEntityDialog
				title="Are you sure?"
				description="This will permanently delete your folder and all related invocations."
				open={openDialog === 'delete'}
				onOpenChange={() => setOpenDialog(null)}
				onConfirm={() => {
					deleteFolderMutation(folder.id);
					window.umami.track('Delete folder');
					setOpenDialog(null);
				}}
			/>
			<EditEntityDialog
				id={folder.id}
				defaultName={folder.name}
				open={openDialog === 'edit'}
				onOpenChange={() => setOpenDialog(null)}
				title="Edit folder"
				description="Let's name your folder"
				onEdit={({ name }) => {
					editFolderMutation({ id: folder.id, name });
					window.umami.track('Edit folder');
					setOpenDialog(null);
				}}
				isLoading={isEditingFolder}
			/>
		</>
	);
};

export default Folder;
