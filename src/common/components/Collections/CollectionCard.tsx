import { MoreVertical } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import DeleteCollectionDialog from './DeleteCollectionDialog';
import EditCollectionDialog from './EditCollectionDialog';

const MoreOptions = ({
	onClickEdit,
	onClickDelete,
}: {
	onClickEdit: () => void;
	onClickDelete: () => void;
}) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				data-test="collection-options-btn"
				className="absolute right-4 top-4"
				asChild
			>
				<Button variant="ghost" className="rounded-md px-3 py-2">
					<MoreVertical className="text-slate-400" size={16} />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent data-test="collection-options-container">
				<DropdownMenuItem onClick={onClickEdit}>Edit</DropdownMenuItem>
				<DropdownMenuItem
					onClick={onClickDelete}
					data-test="collection-options-delete"
				>
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const CollectionCard = ({ id, name }: { id: string; name: string }) => {
	const [activeDialog, setActiveDialog] = React.useState<
		'edit' | 'delete' | null
	>(null);
	const navigate = useNavigate();

	return (
		<div className="relative">
			<Button
				variant="ghost"
				className="p-6 flex justify-between items-start gap-4 border-solid border-2 rounded-lg border-primary h-[200px] w-[300px] font-bold"
				onClick={() => navigate(`/collection/${id}`)}
			>
				<span>{name}</span>
			</Button>
			<MoreOptions
				onClickEdit={() => setActiveDialog('edit')}
				onClickDelete={() => setActiveDialog('delete')}
			/>
			<DeleteCollectionDialog
				id={id}
				open={activeDialog === 'delete'}
				onOpenChange={() => setActiveDialog(null)}
			/>
			<EditCollectionDialog
				id={id}
				name={name}
				open={activeDialog === 'edit'}
				onOpenChange={() => setActiveDialog(null)}
			/>
		</div>
	);
};

export default CollectionCard;
