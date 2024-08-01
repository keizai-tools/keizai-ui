import { Fragment, ReactElement, ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import FullscreenLoading from '@/common/views/FullscreenLoading';
import { useAuthProvider } from '@/modules/auth/hooks/useAuthProvider';

function ProtectedRoute({
	children,
}: Readonly<{
	children: ReactNode;
}>): ReactElement | null {
	const { handleRefreshSession, loadingState, statusState } = useAuthProvider();
	useEffect(() => {
		handleRefreshSession();
	}, [handleRefreshSession]);

	if (loadingState.refreshSession) {
		return <FullscreenLoading />;
	}

	if (statusState.refreshSession) {
		return <Fragment>{children}</Fragment>;
	} else {
		return <Navigate to="auth/login" replace />;
	}
}

export default ProtectedRoute;
