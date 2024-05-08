import { Loader } from 'lucide-react';
import React from 'react';
import { useParams } from 'react-router-dom';

import { CollectionVariables } from './CollectionVariables';

import { useCollectionQuery } from '@/common/api/collections';
import { useEnvironmentsQuery } from '@/common/api/enviroments';

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
			<div className="flex flex-1 h-full w-full justify-center items-center">
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
