import React, { Fragment } from 'react';

import { useEphemeralProvider } from '@/common/context/useEphemeralContext';
import OverlayLoading from '@/common/views/OverlayLoading';
import { useAuthProvider } from '@/modules/auth/hooks/useAuthProvider';

export function AppLoader({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const { statusState } = useAuthProvider();
  const { walletLoading, isStarting, isStopping } = useEphemeralProvider();

  if (walletLoading) {
    return <OverlayLoading type="wallet" />;
  }

  if (isStarting) {
    return <OverlayLoading type="start" />;
  }

  if (isStopping) {
    return <OverlayLoading type="stop" />;
  }

  if (statusState.refreshSession.loading) {
    return <OverlayLoading />;
  }

  return <Fragment>{children}</Fragment>;
}
