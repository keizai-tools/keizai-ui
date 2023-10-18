import { Button } from '../ui/button';
import Folder from './Folder';

import { useCollections } from '@/providers/CollectionsProvider';

const Collections = () => {
	const { selectedCollection } = useCollections();

	return (
		<div
			className="w-[300px] flex-col border-r dark:border-r-border h-full px-3 py-1 gap-4"
			data-test="collections-container"
		>
			<div
				className="flex items-center justify-between"
				data-test="collections-header"
			>
				<h4 className="text-lg font-bold" data-test="collections-header-title">
					Collections
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
					<Button
						variant="link"
						className="p-2 text-foreground"
						data-test="collections-header-btn-import"
						disabled
					>
						Import
					</Button>
				</div>
			</div>
			{selectedCollection?.folders.length ? (
				<div className="flex flex-col ml-5 text-slate-400">
					{selectedCollection.folders.map((folder) => (
						<Folder
							key={folder.id}
							folder={folder}
							onRemove={() => {
								// TODO Implement remove folder
							}}
						/>
					))}
				</div>
			) : (
				<span
					className="text-xs text-slate-400 ml-7"
					data-test="collection-empty-folders"
				>
					No folders
				</span>
			)}
		</div>
	);
};

export default Collections;
