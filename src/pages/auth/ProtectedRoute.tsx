import { ReactElement, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import FullscreenLoading from '@/common/views/FullscreenLoading';
import { useAuth } from '@/services/auth/hook/useAuth';

function ProtectedRoute({
	children,
}: {
	children: ReactNode;
}): ReactElement | null {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return <FullscreenLoading />;
	}

	if (isAuthenticated) {
		return <>{children}</>;
	} else {
		return <Navigate to="auth/login" replace />;
	}
}

export default ProtectedRoute;
