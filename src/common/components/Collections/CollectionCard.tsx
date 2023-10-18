import { MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

const MoreOptions = ({
	onClickEdit,
	onClickDelete,
}: {
	onClickEdit: () => void;
	onClickDelete: () => void;
}) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger data-test="collection-options-btn">
				<MoreVertical className="text-slate-400" size={16} />
			</DropdownMenuTrigger>
			<DropdownMenuContent data-test="collection-options-container">
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

const CollectionCard = ({ id, name }: { id: string; name: string }) => {
	const navigate = useNavigate();

	return (
		<Button
			variant="ghost"
			className="p-6 flex justify-between items-start gap-4 border-solid border-2 rounded-lg border-primary h-[200px] w-[300px] font-bold"
			onClick={() => navigate(`/collection/${id}`)}
		>
			<span>{name}</span>
			{/* TODO Implement options */}
			{/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
			<MoreOptions onClickEdit={() => {}} onClickDelete={() => {}} />
		</Button>
	);
};

export default CollectionCard;
