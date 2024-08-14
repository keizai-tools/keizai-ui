import { ArrowLeftIcon, PlusIcon } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import NewEntityDialog from '../entity/newEntityDialog';
import { Button } from '../ui/button';
import Folder from './folder';

import {
	useFoldersByCollectionIdQuery,
	useCreateFolderMutation,
} from '@/common/api/folders';

function Folders() {
	const params = useParams();
	const { data, isLoading } = useFoldersByCollectionIdQuery({
		id: params.collectionId,
	});

	const { mutate, isPending } = useCreateFolderMutation();
	const navigate = useNavigate();

	async function onCreateFolder({ name }: { name: string }) {
		if (params.collectionId) {
			mutate({ name, collectionId: params.collectionId });
			if (window.umami) window?.umami?.track('Create folder');
		}
	}

	function renderFoldersContent() {
		if (isLoading) {
			return (
				<span className="text-xs text-slate-400" data-test="collection-loading">
					Loading folders...
				</span>
			);
		}

		if (data && data.length > 0) {
			return (
				<div className="flex flex-col text-slate-400">
					{data.map((folder) => (
						<Folder key={folder.id} folder={folder} />
					))}
				</div>
			);
		}

		return (
			<span
				className="text-xs text-slate-400"
				data-test="collection-empty-folders"
			>
				Create your first folder here
			</span>
		);
	}

	return (
		<div
			className="min-w-[250px] flex flex-col justify-between border-r dark:border-r-border h-full px-3 py-1 gap-4"
			data-test="collections-container"
		>
			<div data-test="folders-container">
				<Button
					variant="link"
					className="flex items-center gap-2 p-0 text-xs text-primary"
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
						onSubmit={onCreateFolder}
					>
						<Button
							variant="link"
							className="flex h-auto gap-1 px-0 py-1 text-xs text-slate-500 hover:text-slate-100"
							data-test="collections-header-btn-new"
						>
							<PlusIcon size={12} /> Add
						</Button>
					</NewEntityDialog>
				</div>
				{renderFoldersContent()}
			</div>
			<div className="w-full mb-4 text-base font-semibold text-center hover:underline">
				<Link
					className="text-primary"
					data-test="collections-variables-btn-link"
					to={`/collection/${params.collectionId}/variables`}
				>
					Collection variables
				</Link>
			</div>
		</div>
	);
}

export default Folders;
