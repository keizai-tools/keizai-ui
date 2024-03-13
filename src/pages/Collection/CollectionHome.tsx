import { Outlet, useLocation, useParams } from 'react-router-dom';

import { useCollectionsQuery } from '@/common/api/collections';
import CollectionCard from '@/common/components/Collections/CollectionCard';
import CollectionPlaceholder from '@/common/components/Collections/CollectionPlaceholder';
import CollectionsEmptyState from '@/common/components/Collections/CollectionsEmptyState';
import FullscreenLoading from '@/common/views/FullscreenLoading';

export default function CollectionHome() {
	const { teamId } = useParams();
	const { pathname } = useLocation();
	const { data, isLoading } = useCollectionsQuery(teamId);
	const endpoint = teamId ? `/team/${teamId}` : '/user';

	if (isLoading) {
		return <FullscreenLoading />;
	}

	return (
		<main className="flex flex-col p-3 gap-4 w-full">
			{endpoint === pathname ? (
				<>
					<h3
						className="text-xl font-bold"
						data-test="collections-header-title"
					>
						Collections
					</h3>
					{!data || data?.length === 0 ? (
						<div className="flex justify-center items-center h-full">
							<CollectionsEmptyState />
						</div>
					) : (
						<div className="flex gap-8 flex-wrap">
							{data.map((collection) => {
								const invocationsCount = collection.folders.reduce(
									(total, folder) => total + folder.invocations.length,
									0,
								);

								return (
									<CollectionCard
										key={collection.id}
										id={collection.id}
										name={collection.name}
										endpoint={endpoint}
										foldersCount={collection.folders.length ?? 0}
										invocationsCount={invocationsCount ?? 0}
									/>
								);
							})}
							<CollectionPlaceholder />
						</div>
					)}
				</>
			) : (
				<Outlet />
			)}
		</main>
	);
}
