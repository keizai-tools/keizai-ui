import CollectionCard from '@/common/components/Collections/CollectionCard';
import CollectionPlaceholder from '@/common/components/Collections/CollectionPlaceholder';
import FullscreenLoading from '@/common/views/FullscreenLoading';
import { useCollections } from '@/providers/CollectionsProvider';

export default function Home() {
	const { collections, isLoading } = useCollections();

	if (isLoading) {
		return <FullscreenLoading />;
	}

	return (
		<main className="flex flex-col p-3 gap-4">
			<h3 className="text-xl font-bold" data-test="collections-header-title">
				Collections
			</h3>
			<div className="flex gap-8 flex-wrap">
				{collections.map((collection) => (
					<CollectionCard id={collection.id} name={collection.name} />
				))}
				<CollectionPlaceholder />
			</div>
		</main>
	);
}
