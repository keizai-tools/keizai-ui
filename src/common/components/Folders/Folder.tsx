import React from 'react';

import DeleteEntityDialog from '../Entity/DeleteEntityDialog';
import EditEntityDialog from '../Entity/EditEntityDialog';
import MoreOptions from '../Entity/MoreOptions';
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
	const [openDialog, setOpenDialog] = React.useState<'edit' | 'delete' | null>(
		null,
	);
	const { mutate: deleteFolderMutation } = useDeleteFolderMutation();
	const { mutate: editFolderMutation, isPending: isEditingFolder } =
		useEditFolderMutation();

	return (
		<>
			<Accordion type="multiple" className="w-full">
				<AccordionItem value={folder.id} className="border-none">
					<AccordionTrigger
						className="h-10 w-full "
						data-test="collection-folder-container"
					>
						<div className="flex justify-between items-center w-full text-slate-100 text-sm">
							<span data-test="collection-folder-name">{folder.name}</span>
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
						{folder.invocations?.length ? (
							<div className="flex flex-col gap-2 ml-4 text-slate-100">
								{[].map(() => (
									<span>Name</span>
								))}
							</div>
						) : (
							<NewInvocationButton />
						)}
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
					editFolderMutation({ id: folder.id, name: name });
					setOpenDialog(null);
				}}
				isLoading={isEditingFolder}
			/>
		</>
	);
};

export default Folder;
