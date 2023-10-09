import { MoreVertical } from 'lucide-react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/common/components/ui/dropdown-menu';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/common/components/ui/tooltip';

const MoreOptions = ({
	onAddFolder,
	onClickEdit,
	onClickDelete,
}: {
	onAddFolder?: () => void;
	onClickEdit: () => void;
	onClickDelete: () => void;
}) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger data-test="collection-options-btn">
				<MoreVertical className="text-slate-500" size={13} />
			</DropdownMenuTrigger>
			<DropdownMenuContent data-test="collection-options-container">
				{onAddFolder && (
					<DropdownMenuItem
						onClick={onAddFolder}
						data-test="collection-options-add"
					>
						Add Folder
					</DropdownMenuItem>
				)}
				<DropdownMenuItem onClick={onClickEdit}>
					<Tooltip delayDuration={0}>
						<TooltipTrigger
							className="w-full text-left"
							data-test="collection-options-edit"
						>
							Edit
						</TooltipTrigger>
						<TooltipContent>
							<p data-test="collection-options-edit-tooltip">Coming soon</p>
						</TooltipContent>
					</Tooltip>
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
};

export default MoreOptions;
