/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useCallback, useMemo } from 'react';

import {
  useEphemeralStatusMutation,
  useEphemeralStartMutation,
  useEphemeralStopMutation,
} from '../api/ephemeral';
import { useEphemeralInvocationsMutation } from '../api/invocations';

import { useAuthProvider } from '@/modules/auth/hooks/useAuthProvider';

export function useEphemeral(
  setLoading: (loading: boolean) => void,
  setStatus: (status: {
    status: string;
    taskArn: string;
    publicIp: string;
    taskStartedAt: string;
    taskStoppedAt: string;
    executionInterval: number;
    isEphemeral: boolean;
  }) => void,
  status: {
    status: string;
    taskArn: string;
    publicIp: string;
    taskStartedAt: string;
    taskStoppedAt: string;
    executionInterval: number;
    isEphemeral: boolean;
  },
) {
  const { mutateAsync: getStatus, isError: isStatusError } =
    useEphemeralStatusMutation();
  const { mutateAsync } = useEphemeralInvocationsMutation();

  const {
    mutateAsync: startEphemeral,
    isPending: isStartPending,
    isError: isStartError,
  } = useEphemeralStartMutation();
  const {
    mutateAsync: stopEphemeral,
    isPending: isStopPending,
    isError: isStopError,
  } = useEphemeralStopMutation();

  const { statusState, onCreateAccountEphimeral, onDeleteAccountEphimeral } =
    useAuthProvider();

  const fetchStatus = useCallback(async (): Promise<void> => {
    try {
      const currentStatus = await getStatus();

      setStatus({
        ...currentStatus,
        isEphemeral: currentStatus.status === 'RUNNING',
      });
      if (currentStatus.status === 'RUNNING') {
        try {
          onCreateAccountEphimeral(currentStatus.publicIp);
        } catch (error) {
          console.error('Failed to update network:', error);
        }
      }
    } catch (error) {
      onDeleteAccountEphimeral();
      await mutateAsync();
      setStatus({
        status: 'STOPPED',
        taskArn: '',
        publicIp: '',
        isEphemeral: false,
        executionInterval: 0,
        taskStartedAt: '',
        taskStoppedAt: '',
      });
    }
  }, [getStatus, onCreateAccountEphimeral]);

  const isLoading = useMemo(
    () =>
      [isStartPending, isStopPending, statusState.wallet.loading].some(Boolean),
    [isStartPending, isStopPending, statusState.wallet.loading],
  );

  const handleStart = useCallback(
    async ({ interval }: { interval: number }): Promise<void> => {
      try {
        setLoading(true);
        onDeleteAccountEphimeral();
        const startResponse = await startEphemeral({ interval });
        if (startResponse) {
          setStatus({
            isEphemeral: true,
            ...startResponse,
          });
          try {
            onCreateAccountEphimeral(startResponse.publicIp);
          } catch (error) {
            console.error('Failed to update network:', error);
          }
        }
      } catch (error) {
        console.error('Failed to start ephemeral instance:', error);
      } finally {
        setLoading(false);
      }
    },
    [startEphemeral, onCreateAccountEphimeral],
  );

  const handleStop = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      onDeleteAccountEphimeral();
      await stopEphemeral();
      setStatus({
        status: 'STOPPED',
        taskArn: '',
        publicIp: '',
        isEphemeral: false,
        executionInterval: 0,
        taskStartedAt: '',
        taskStoppedAt: '',
      });
    } catch (error) {
      console.error('Failed to stop ephemeral instance:', error);
    } finally {
      setLoading(false);
    }
  }, [stopEphemeral]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const isError = useMemo(
    () =>
      [isStatusError, isStartError, isStopError, statusState.wallet.error].some(
        Boolean,
      ),
    [isStatusError, isStartError, isStopError, statusState.wallet.error],
  );

  return {
    status,
    handleStart,
    handleStop,
    isError,
    isLoading,
    fetchStatus,
    walletLoading: statusState.wallet.loading,
    setEphemeral: (variable: boolean) =>
      setStatus({ ...status, isEphemeral: variable }),
  };
}
