'use client';

import { Loader } from 'lucide-react';
import React from 'react';

import { useCollections } from '@/providers/CollectionsProvider';

export const AppLoader = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => {
	const { loading } = useCollections();

	if (loading) {
		return (
			<div className="flex items-center justify-center w-full">
				<Loader className="animate-spin" size={36} />
			</div>
		);
	}

	return <>{children}</>;
};
