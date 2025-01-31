import { Fragment, ReactElement, ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import OverlayLoading from '@/common/views/OverlayLoading';
import { useAuthProvider } from '@/modules/auth/hooks/useAuthProvider';

function ProtectedRoute({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactElement | null {
  const { handleRefreshSession, statusState } = useAuthProvider();
  useEffect(() => {
    if (
      !statusState.refreshSession.status &&
      !statusState.refreshSession.loading
    ) {
      handleRefreshSession();
    }
  }, [
    handleRefreshSession,
    statusState.refreshSession.loading,
    statusState.refreshSession.status,
  ]);

  if (statusState.refreshSession.loading) {
    return <OverlayLoading />;
  }

  if (statusState.refreshSession.status) {
    return <Fragment>{children}</Fragment>;
  } else {
    return <Navigate to="auth/login" replace />;
  }
}

export default ProtectedRoute;
