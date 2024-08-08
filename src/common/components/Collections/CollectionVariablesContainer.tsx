import { Loader } from 'lucide-react';
import React from 'react';
import { useParams } from 'react-router-dom';

import { CollectionVariables } from './CollectionVariables';

import { useCollectionQuery } from '@/common/api/collections';
import { useEnvironmentsQuery } from '@/common/api/environments';

export const CollectionVariablesContainer = () => {
	const params = useParams();
	const collectionId = React.useMemo(() => {
		return params.collectionId ?? '';
	}, [params]);
	const { data: collection } = useCollectionQuery(collectionId);
	const { data, isLoading, isRefetching } = useEnvironmentsQuery({
		collectionId,
	});

	const environmentsValue = React.useMemo(() => {
		return data ? data : [];
	}, [data]);

	if (isLoading || isRefetching) {
		return (
			<div className="flex items-center justify-center flex-1 w-full h-full">
				<Loader className="animate-spin" size="36" />
			</div>
		);
	}

	return (
		<CollectionVariables
			collection={collection}
			collectionId={collectionId}
			environments={environmentsValue}
		/>
	);
};
