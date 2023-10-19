import CollectionCard from '@/common/components/Collections/CollectionCard';
import CollectionPlaceholder from '@/common/components/Collections/CollectionPlaceholder';
import CollectionsEmptyState from '@/common/components/Collections/CollectionsEmptyState';
import FullscreenLoading from '@/common/views/FullscreenLoading';
import { useCollections } from '@/providers/CollectionsProvider';

export default function Home() {
	const { collections, isLoading } = useCollections();

	if (isLoading) {
		return <FullscreenLoading />;
	}

	return (
		<main className="flex flex-col p-3 gap-4 w-full">
			<h3 className="text-xl font-bold" data-test="collections-header-title">
				Collections
			</h3>
			{collections.length === 0 ? (
				<div className="flex justify-center items-center h-full">
					<CollectionsEmptyState />
				</div>
			) : (
				<div className="flex gap-8 flex-wrap">
					{collections.map((collection) => (
						<CollectionCard
							key={collection.id}
							id={collection.id}
							name={collection.name}
						/>
					))}
					<CollectionPlaceholder />
				</div>
			)}
		</main>
	);
}
