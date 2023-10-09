'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { Invocation } from './InvocationProvider';

export type Folder = {
	id: string;
	name: string;
	invocations: Invocation[];
};

type Collection = {
	id: string;
	name: string;
	folders: Folder[];
};
/* eslint-disable @typescript-eslint/no-empty-function */
const CollectionsContext = createContext<{
	loading: boolean;
	collections: Collection[];
	addCollection: (name: string) => void;
	removeCollection: (id: string) => void;
	selectedCollection: Collection | null;
	selectCollection: (id: string) => void;
	addFolderToCollection: (id: string, name: string) => void;
	removeFolderFromCollection: (id: string, folderId: string) => void;
}>({
	loading: true,
	collections: [],
	addCollection: () => {},
	removeCollection: () => {},
	selectedCollection: null,
	selectCollection: () => {},
	addFolderToCollection: () => {},
	removeFolderFromCollection: () => {},
});

export const CollectionsProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [loading, setLoading] = useState(true);
	const [collections, setCollections] = useState<Collection[]>([]);
	const [selectedCollection, setSelectedCollection] =
		useState<Collection | null>(null);
	setLoading(false);

	useEffect(() => {
		const selectedCollectionData = collections.find(
			(collection) => collection.id === selectedCollection?.id,
		);

		if (
			selectedCollectionData &&
			selectedCollectionData?.folders.length !==
				selectedCollection?.folders.length
		) {
			setSelectedCollection(selectedCollectionData);
		}
	}, [collections, selectedCollection?.folders.length, selectedCollection?.id]);

	const updateCollections = (newValue: Collection[]) => {
		setCollections(newValue);
	};

	const addCollection = (name: string) => {
		const newValue = [
			...collections,
			{
				id: new Date().getTime().toString(),
				name,
				folders: [],
			},
		];

		updateCollections(newValue);
		setSelectedCollection(newValue[newValue.length - 1]);
	};

	const removeCollection = (id: string) => {
		const newValue = collections.filter((collection) => collection.id !== id);

		updateCollections(newValue);

		if (newValue[0]) {
			setSelectedCollection(newValue[0]);
		} else {
			setSelectedCollection(null);
		}
	};

	const selectCollection = (id: string) => {
		const newValue = collections.find((collection) => collection.id === id);

		if (!newValue) return;

		setSelectedCollection(newValue);
	};

	const addFolderToCollection = (id: string, name: string) => {
		const newValue = collections.map((collection) => {
			if (collection.id === id) {
				return {
					...collection,
					folders: [
						...collection.folders,
						{
							id: new Date().getTime().toString(),
							name,
							invocations: [],
						},
					],
				};
			}

			return collection;
		});

		updateCollections(newValue);
	};

	const removeFolderFromCollection = (id: string, folderId: string) => {
		const newValue = collections.map((collection) => {
			if (collection.id === id) {
				return {
					...collection,
					folders: collection.folders.filter(
						(folder) => folder.id !== folderId,
					),
				};
			}

			return collection;
		});

		updateCollections(newValue);
	};

	return (
		<CollectionsContext.Provider
			value={{
				collections,
				addCollection,
				removeCollection,
				selectedCollection,
				selectCollection,
				addFolderToCollection,
				removeFolderFromCollection,
				loading,
			}}
		>
			{children}
		</CollectionsContext.Provider>
	);
};

export const useCollections = () => useContext(CollectionsContext);
