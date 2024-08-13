import { MoreVerticalIcon } from 'lucide-react';
import React from 'react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';

function MoreOptions({
	onClickEdit,
	onClickDelete,
}: Readonly<{
	onClickEdit: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	onClickDelete: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}>) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				data-test="collection-options-btn"
				className={`rounded-full p-1 hover:bg-slate-800`}
				asChild
			>
				<MoreVerticalIcon className="text-slate-400" size={22} />
			</DropdownMenuTrigger>
			<DropdownMenuContent data-test="collection-options-container">
				<DropdownMenuItem
					onClick={onClickEdit}
					data-test="collection-options-edit"
				>
					Edit
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={onClickDelete}
					data-test="collection-options-delete"
				>
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default MoreOptions;
