'use client';

import React from 'react';

import { Button } from '@/common/components/ui/button';
import { useCollections } from '@/providers/CollectionsProvider';

const InvocationPage = ({ children }: { children: React.ReactNode }) => {
	const { selectedCollection, addCollection } = useCollections();

	if (!selectedCollection) {
		return (
			<div
				className="flex flex-col justify-center items-center w-full gap-7"
				data-test="invocation-page-container"
			>
				<img
					src="/blocks.svg"
					alt="New collection image"
					width={300}
					height={300}
					data-test="invocation-page-img"
				/>
				<h1
					className="text-4xl text-primary font-bold"
					data-test="invocation-page-description"
				>
					Create your first collection
				</h1>
				<Button
					onClick={() => addCollection('New collection 1')}
					data-test="invocation-page-btn"
				>
					New collection
				</Button>
			</div>
		);
	}

	return (
		<div
			className="flex flex-col justify-between w-full gap-7"
			data-test="home-page-container"
		>
			{children}
		</div>
	);
};

export default InvocationPage;
