/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback, useMemo } from 'react';

import {
  useEphemeralStatusMutation,
  useEphemeralStartMutation,
  useEphemeralStopMutation,
} from '../api/ephemeral';
import { NETWORK } from '../types/soroban.enum';
import useNetwork from './useNetwork';

import { useAuthProvider } from '@/modules/auth/hooks/useAuthProvider';

export function useEphemeral(setLoading: (loading: boolean) => void) {
  const {
    mutateAsync: getStatus,
    isPending: isStatusPending,
    isError: isStatusError,
  } = useEphemeralStatusMutation();
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
  const { handleUpdateNetwork } = useNetwork(false);

  const [status, setStatus] = useState({
    status: 'STOPPED',
    taskArn: '',
    publicIp: '',
    isEphemeral: false,
  });

  const fetchStatus = useCallback(async (): Promise<void> => {
    try {
      if (status.status === 'STOPPED') {
        const currentStatus = await getStatus();
        if (currentStatus.status === 'RUNNING') {
          setStatus({
            ...currentStatus,
            isEphemeral: true,
          });
          handleUpdateNetwork(NETWORK.EPHEMERAL);
          onCreateAccountEphimeral(currentStatus.publicIp);
        }
      }
    } catch (error) {
      console.error('Failed to fetch status:', error);
    }
  }, [status.status, getStatus, onCreateAccountEphimeral, handleUpdateNetwork]);

  const isLoading = useMemo(
    () =>
      [
        isStartPending,
        isStopPending,
        isStatusPending,
        statusState.wallet.loading,
      ].some(Boolean),
    [
      isStartPending,
      isStopPending,
      isStatusPending,
      statusState.wallet.loading,
    ],
  );

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleStart = useCallback(
    async ({ interval }: { interval: number }): Promise<void> => {
      try {
        setLoading(true);
        const startResponse = await startEphemeral({ interval });
        if (startResponse) {
          setStatus({
            status: 'RUNNING',
            taskArn: startResponse.taskArn,
            publicIp: startResponse.publicIp,
            isEphemeral: true,
          });
          onCreateAccountEphimeral(startResponse.publicIp);
          handleUpdateNetwork(NETWORK.EPHEMERAL);
        }
      } catch (error) {
        console.error('Failed to start ephemeral instance:', error);
      } finally {
        setLoading(false);
      }
    },
    [startEphemeral, onCreateAccountEphimeral, handleUpdateNetwork],
  );

  const handleStop = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      await stopEphemeral();
      onDeleteAccountEphimeral();
      setStatus({
        status: 'STOPPED',
        taskArn: '',
        publicIp: '',
        isEphemeral: false,
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
    setEphemeral: (variable: boolean) =>
      setStatus({ ...status, isEphemeral: variable }),
  };
}
