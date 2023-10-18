import { Loader } from 'lucide-react';
import React from 'react';

import { useAuth } from '@/services/auth/hook/useAuth';

('use client');

export const AppLoader = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => {
	const { isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center w-full">
				<Loader className="animate-spin" size={36} />
			</div>
		);
	}

	return <>{children}</>;
};
