import { useCollectionsQuery } from '@/common/api/collections';
import CollectionCard from '@/common/components/Collections/CollectionCard';
import CollectionPlaceholder from '@/common/components/Collections/CollectionPlaceholder';
import CollectionsEmptyState from '@/common/components/Collections/CollectionsEmptyState';
import FullscreenLoading from '@/common/views/fullscreenLoading';

export default function Home() {
  const { data, isLoading } = useCollectionsQuery();

  if (isLoading) {
    return <FullscreenLoading />;
  }

  return (
    <main className="flex flex-col w-full h-auto gap-4 m-5">
      <h3 className="text-xl font-bold" data-test="collections-header-title">
        Collections
      </h3>
      {!data || data?.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <CollectionsEmptyState />
        </div>
      ) : (
        <div className="flex flex-wrap gap-8">
          {data?.map((collection) => {
            const invocationsCount = collection.folders.reduce(
              (total, folder) => total + folder.invocations.length,
              0,
            );

            return (
              <CollectionCard
                key={collection.id}
                id={collection.id}
                name={collection.name}
                foldersCount={collection.folders.length ?? 0}
                invocationsCount={invocationsCount ?? 0}
              />
            );
          })}
          <CollectionPlaceholder />
        </div>
      )}
    </main>
  );
}
