import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '../ui/accordion';
import { Button } from '../ui/button';
import Folder from './Folder';
import MoreOptions from './MoreOptions';

import { useCollections } from '@/providers/CollectionsProvider';

const Collections = () => {
	const {
		collections,
		addCollection,
		removeCollection,
		addFolderToCollection,
		removeFolderFromCollection,
	} = useCollections();
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
						onClick={() =>
							addCollection(`New collection ${collections.length + 1}`)
						}
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
			<Accordion
				type="multiple"
				className="w-full"
				data-test="collections-accordion-container"
			>
				{collections.map((collection) => (
					<AccordionItem
						key={collection.id}
						value={collection.id}
						className="border-none"
						data-test="collections-accordion-item"
					>
						<div className="flex justify-between items-center">
							<AccordionTrigger
								className="h-10 w-full"
								data-test="collection-item-btn"
							>
								<div className="flex justify-between items-center w-full group">
									<span data-test="collection-item-name">
										{collection.name}
									</span>
								</div>
							</AccordionTrigger>
							<MoreOptions
								onAddFolder={() =>
									addFolderToCollection(collection.id, 'New Folder')
								}
								// eslint-disable-next-line @typescript-eslint/no-empty-function
								onClickEdit={() => {}}
								onClickDelete={() => removeCollection(collection.id)}
							/>
						</div>
						<AccordionContent>
							<div className="flex flex-col gap-2 ml-5">
								{collection.folders.length ? (
									<div className="flex flex-col ml-5 text-slate-400">
										{collection.folders.map((folder) => (
											<Folder
												key={folder.id}
												folder={folder}
												onRemove={() =>
													removeFolderFromCollection(collection.id, folder.id)
												}
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
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	);
};

export default Collections;
