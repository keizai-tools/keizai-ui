import { FileText } from 'lucide-react';
import React from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

import DeleteEntityDialog from '../Entity/DeleteEntityDialog';
import EditEntityDialog from '../Entity/EditEntityDialog';
import MoreOptions from '../Entity/MoreOptions';
import { Button } from '../ui/button';

import {
	useDeleteInvocationMutation,
	useEditInvocationMutation,
} from '@/common/api/invocations';
import { useEndpoint } from '@/common/hooks/useEndpoint';
import { Invocation } from '@/common/types/invocation';

const InvocationListItem = ({ invocation }: { invocation: Invocation }) => {
	const { collectionId, teamId, invocationId } = useParams();
	const navigate = useNavigate();
	const { endpoint } = useEndpoint();
	const [openDialog, setOpenDialog] = React.useState<'edit' | 'delete' | null>(
		null,
	);
	const { mutate: deleteInvocationMutation } = useDeleteInvocationMutation(
		collectionId,
		teamId,
	);
	const { mutate: editInvocationMutation, isPending: isEditingInvocation } =
		useEditInvocationMutation();

	return (
		<>
			<div
				className="flex justify-between items-center w-full text-slate-100 text-sm group"
				data-test="invocation-item"
			>
				<Button
					variant="link"
					className="text-slate-100 w-full flex justify-start"
					asChild
				>
					<NavLink to={`invocation/${invocation?.id}`}>
						<div
							data-test="invocation-list-container"
							className={`flex gap-1 items-center ${
								invocationId && invocationId === invocation.id && 'text-primary'
							}`}
						>
							<FileText size={16} />
							<span data-test="collection-folder-name">{invocation.name}</span>
						</div>
					</NavLink>
				</Button>
				<div className="invisible group-hover:visible">
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
			<DeleteEntityDialog
				title="Are you sure?"
				description="This will permanently delete your invocation."
				open={openDialog === 'delete'}
				onOpenChange={() => setOpenDialog(null)}
				onConfirm={() => {
					deleteInvocationMutation(invocation.id);
					window.umami.track('Delete invocation');
					if (invocationId === invocation.id) {
						navigate(`${endpoint}/collection/${collectionId}`);
					}
					setOpenDialog(null);
				}}
			/>
			<EditEntityDialog
				id={invocation.id}
				defaultName={invocation.name}
				open={openDialog === 'edit'}
				onOpenChange={() => setOpenDialog(null)}
				title="Edit invocation"
				description="Let's name your invocation"
				onEdit={({ name }) => {
					editInvocationMutation({
						id: invocation.id,
						name: name,
					});
					window.umami.track('Edit invocation');
					setOpenDialog(null);
				}}
				isLoading={isEditingInvocation}
			/>
		</>
	);
};

export default InvocationListItem;
