import { ArrowLeftIcon, PlusIcon } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import NewEntityDialog from '../Entity/NewEntityDialog';
import { Button } from '../ui/button';
import Folder from './Folder';

import {
	useCreateFolderMutation,
	useFoldersByCollectionIdQuery,
} from '@/common/api/folders';

const Folders = () => {
	const params = useParams();
	const { data, isLoading } = useFoldersByCollectionIdQuery({
		id: params.collectionId,
	});
	const { mutate, isPending } = useCreateFolderMutation();
	const navigate = useNavigate();

	return (
		<div
			className="min-w-[250px] flex-col justify-between border-r dark:border-r-border h-full px-3 py-1 gap-4"
			data-test="collections-container"
		>
			<div data-test="folders-container">
				<Button
					variant="link"
					className="flex items-center gap-2 text-xs text-primary p-0"
					onClick={() => navigate('/')}
				>
					<ArrowLeftIcon size={16} /> Collections
				</Button>
				<div
					className="flex items-center justify-between mb-3"
					data-test="collections-header"
				>
					<h4
						className="text-lg font-bold"
						data-test="collections-header-title"
					>
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
							variant="link"
							className="text-xs px-0 py-1 h-auto flex gap-1 text-slate-500	hover:text-slate-100"
							data-test="collections-header-btn-new"
						>
							<PlusIcon size={12} /> Add
						</Button>
					</NewEntityDialog>
				</div>
				{isLoading ? (
					<span
						className="text-xs text-slate-400"
						data-test="collection-loading"
					>
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
						Create your first folder here
					</span>
				)}
			</div>
			<div>
				<Link
					className="mb-4 w-full"
					data-test="collections-variables-btn-link"
					to={`/collection/${params.collectionId}/variables`}
				>
					Collection variables
				</Link>
			</div>
		</div>
	);
};

export default Folders;
