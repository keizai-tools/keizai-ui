/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';

import {
  useEphemeralStatusMutation,
  useEphemeralStartMutation,
  useEphemeralStopMutation,
} from '../api/ephemeral';
import { NETWORK } from '../types/soroban.enum';
import useNetwork from './useNetwork';

import { useAuthProvider } from '@/modules/auth/hooks/useAuthProvider';

export interface EphemeralStatus {
  status: string;
  taskArn: string;
  publicIp: string;
  isEphemeral?: boolean;
}

function useEphemeral() {
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

  const { statusState, onCreateAccountEphimeral } = useAuthProvider();
  const { handleUpdateNetwork } = useNetwork(false);

  const [status, setStatus] = useState<EphemeralStatus>({
    status: 'STOPPED',
    taskArn: '',
    publicIp: '',
    isEphemeral: false,
  });

  const fetchStatus = async () => {
    try {
      if (status.status === 'STOPPED') {
        const currentStatus = await getStatus();
        if (currentStatus.status === 'RUNNING') {
          setStatus(currentStatus);
          onCreateAccountEphimeral(currentStatus.publicIp);
          handleUpdateNetwork(NETWORK.EPHEMERAL);
        }
      }
    } catch (error) {
      console.error('Failed to fetch status:', error);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleStart = useCallback(
    async ({ interval }: { interval: number }) => {
      try {
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
      }
    },
    [startEphemeral, onCreateAccountEphimeral, handleUpdateNetwork],
  );

  const handleStop = useCallback(async () => {
    try {
      await stopEphemeral();
      setStatus({
        status: 'STOPPED',
        taskArn: '',
        publicIp: '',
        isEphemeral: false,
      });
    } catch (error) {
      console.error('Failed to stop ephemeral instance:', error);
    }
  }, [stopEphemeral]);

  const isLoading = [
    isStartPending,
    isStopPending,
    isStatusPending,
    statusState.wallet.loading,
  ].some(Boolean);
  const isError = [
    isStatusError,
    isStartError,
    isStopError,
    statusState.wallet.error,
  ].some(Boolean);

  return {
    status,
    handleStart,
    handleStop,
    isError,
    isLoading,
    fetchStatus,
  };
}

export default useEphemeral;
