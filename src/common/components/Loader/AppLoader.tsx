import { Loader } from 'lucide-react';
import React, { Fragment } from 'react';

import { useAuthProvider } from '@/modules/auth/hooks/useAuthProvider';

export function AppLoader({
	children,
}: Readonly<{
	children: React.ReactNode;
}>): JSX.Element {
	const { statusState } = useAuthProvider();

	if (statusState.refreshSession.loading) {
		return (
			<div className="flex items-center justify-center w-full">
				<Loader className="animate-spin" size={36} />
			</div>
		);
	}

	return <Fragment>{children}</Fragment>;
}
