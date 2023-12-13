import { Loader } from 'lucide-react';
import React from 'react';
import { useParams } from 'react-router-dom';

import { CollectionVariables } from './CollectionVariables';

import { useCollectionQuery } from '@/common/api/collections';
import useEnvironments from '@/common/hooks/useEnvironments';

export const CollectionVariablesContainer = () => {
	const params = useParams();
	const { environments, isLoading } = useEnvironments();

	const collectionId = React.useMemo(() => {
		return params.collectionId ?? '';
	}, [params]);
	const { data: collection } = useCollectionQuery(collectionId);

	if (isLoading) {
		return (
			<div className="flex flex-1 h-full w-full justify-center items-center">
				<Loader className="animate-spin" size="36" />
			</div>
		);
	}

	return (
		<CollectionVariables
			collection={collection}
			collectionId={collectionId}
			environments={environments}
		/>
	);
};
