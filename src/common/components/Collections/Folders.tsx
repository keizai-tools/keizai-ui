import { ArrowLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../ui/button';
import Folder from './Folder';

const Folders = () => {
	const navigate = useNavigate();

	return (
		<div
			className="w-[300px] flex-col border-r dark:border-r-border h-full px-3 py-1 gap-4"
			data-test="collections-container"
		>
			<Button
				variant="link"
				className="flex items-center gap-2 text-xs text-primary p-0"
				onClick={() => navigate('/')}
			>
				<ArrowLeftIcon size={16} /> Collections
			</Button>
			<div
				className="flex items-center justify-between"
				data-test="collections-header"
			>
				<h4 className="text-lg font-bold" data-test="collections-header-title">
					Folders
				</h4>
				<div className="">
					<Button
						variant="secondary"
						className="text-xs px-2 py-1 h-auto"
						onClick={() => {
							// TODO Implement add collection
						}}
						data-test="collections-header-btn-new"
					>
						New
					</Button>
				</div>
			</div>
			{[].length ? (
				<div className="flex flex-col text-slate-400">
					{[].map((folder) => (
						<Folder
							folder={folder}
							onRemove={() => {
								// TODO Implement remove folder
							}}
						/>
					))}
				</div>
			) : (
				<span
					className="text-xs text-slate-400"
					data-test="collection-empty-folders"
				>
					No folders
				</span>
			)}
		</div>
	);
};

export default Folders;
