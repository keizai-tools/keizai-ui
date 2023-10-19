import { ArrowLeftIcon, PlusIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import NewEntityDialog from '../Entity/NewEntityDialog';
import { Button } from '../ui/button';
import Folder from './Folder';

import { useCreateFolderMutation, useFoldersQuery } from '@/common/api/folders';

const Folders = () => {
	const { data, isLoading } = useFoldersQuery();
	const { mutate, isPending } = useCreateFolderMutation();
	const params = useParams();
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
				<NewEntityDialog
					title="New folder"
					description="Let's name your folder"
					defaultName="Folder"
					isLoading={isPending}
					onSubmit={async ({ name }) => {
						if (params.collectionId) {
							await mutate({ name, collectionId: params.collectionId });
						}
					}}
				>
					<Button
						variant="ghost"
						className="text-xs px-2 py-1 h-auto flex gap-1"
						data-test="collections-header-btn-new"
					>
						<PlusIcon size={12} /> Add
					</Button>
				</NewEntityDialog>
			</div>
			{isLoading ? (
				<span className="text-xs text-slate-400" data-test="collection-loading">
					Loading folders...
				</span>
			) : data && data.length > 0 ? (
				<div className="flex flex-col text-slate-400">
					{data.map((folder) => (
						<Folder key={folder.id} folder={folder} />
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
