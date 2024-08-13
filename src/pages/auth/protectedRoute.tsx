import { Fragment, ReactElement, ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import FullscreenLoading from '@/common/views/FullscreenLoading';
import { useAuthProvider } from '@/modules/auth/hooks/useAuthProvider';

function ProtectedRoute({
	children,
}: Readonly<{
	children: ReactNode;
}>): ReactElement | null {
	const { handleRefreshSession, statusState } = useAuthProvider();
	useEffect(() => {
		handleRefreshSession();
	}, [handleRefreshSession]);

	if (statusState.refreshSession.loading) {
		return <FullscreenLoading />;
	}

	if (statusState.refreshSession.status) {
		return <Fragment>{children}</Fragment>;
	} else {
		return <Navigate to="auth/login" replace />;
	}
}

export default ProtectedRoute;
