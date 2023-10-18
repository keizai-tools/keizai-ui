/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useContext, useEffect, useState } from 'react';

import { Invocation } from './InvocationProvider';

import { useCollectionsQuery } from '@/common/api/collections';

('use client');

export type Folder = {
	id: string;
	name: string;
	invocations: Invocation[];
};

export type Collection = {
	id: string;
	name: string;
	folders: Folder[];
};

const CollectionsContext = createContext<{
	isLoading: boolean;
	collections: Collection[];
	selectedCollection: Collection | null;
}>({
	isLoading: true,
	collections: [],
	selectedCollection: null,
});

export const CollectionsProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const { data, isLoading } = useCollectionsQuery();
	const [selectedCollection, setSelectedCollection] =
		useState<Collection | null>(null);

	useEffect(() => {
		const selectedCollectionData = data?.find(
			(collection) => collection.id === selectedCollection?.id,
		);

		if (
			selectedCollectionData &&
			selectedCollectionData?.folders.length !==
				selectedCollection?.folders.length
		) {
			setSelectedCollection(selectedCollectionData);
		}
	}, [data, selectedCollection?.folders.length, selectedCollection?.id]);

	return (
		<CollectionsContext.Provider
			value={{
				collections: data || [],
				isLoading,
				selectedCollection,
			}}
		>
			{children}
		</CollectionsContext.Provider>
	);
};

export const useCollections = () => useContext(CollectionsContext);
