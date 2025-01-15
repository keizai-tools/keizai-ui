import {
  createContext,
  ReactNode,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';

import { useEphemeralInvocationsMutation } from '../api/invocations';
import { useEphemeral as useEphemeralHook } from '../hooks/useEphemeral';

import { useAuthProvider } from '@/modules/auth/hooks/useAuthProvider';

interface EphemeralContextType {
  loading: boolean;
  walletLoading: boolean;
  status: {
    status: string;
    taskArn: string;
    publicIp: string;
    taskStartedAt: string;
    taskStoppedAt: string;
    executionInterval: number;
    isEphemeral: boolean;
  };
  countdown: {
    formattedCountdown: string;
    countdown: number | null;
    countdownColor: string;
  };
  handleStart: ({ interval }: { interval: number }) => Promise<void>;
  handleStop: () => Promise<void>;
  isError: boolean;
  isLoading: boolean;
  setEphemeral: (variable: boolean) => void;
  isStarting: boolean;
  isStopping: boolean;
}

const EphemeralContext = createContext<EphemeralContextType | null>(null);

interface EphemeralProviderProps {
  children: ReactNode;
}

export const EphemeralProvider = ({ children }: EphemeralProviderProps) => {
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [status, setStatus] = useState({
    status: 'STOPPED',
    taskArn: '',
    publicIp: '',
    taskStartedAt: '',
    taskStoppedAt: '',
    executionInterval: 0,
    isEphemeral: false,
  });
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);

  const ephemeral = useEphemeralHook(setLoading, setStatus, status);
  const { statusState } = useAuthProvider();
  const { mutateAsync } = useEphemeralInvocationsMutation();

  const [hasFetchedStatus, setHasFetchedStatus] = useState(false);

  useEffect(() => {
    if (
      (statusState.signIn.status || statusState.refreshSession.loading) &&
      !hasFetchedStatus
    ) {
      ephemeral.fetchStatus();
      setHasFetchedStatus(true);
    }
  }, [
    statusState.signIn.status,
    ephemeral,
    hasFetchedStatus,
    statusState.refreshSession.loading,
  ]);

  useEffect(() => {
    if (
      status.status === 'RUNNING' &&
      status.taskStartedAt &&
      status.executionInterval
    ) {
      const interval = setInterval(() => {
        const now = Date.now();
        const startTime = new Date(status.taskStartedAt).getTime();
        const endTime = startTime + status.executionInterval * 60000;
        const timeLeft = Math.max(endTime - now, 0);

        setCountdown(timeLeft);
        if (timeLeft === 0) {
          setStatus({
            status: 'STOPPED',
            taskArn: '',
            publicIp: '',
            taskStartedAt: '',
            taskStoppedAt: '',
            executionInterval: 0,
            isEphemeral: false,
          });
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [status]);

  useEffect(() => {
    if (!statusState.signIn.status) return;

    let intervalId: NodeJS.Timeout | null = null;

    const manageFetch = async () => {
      try {
        await ephemeral.fetchStatus();
      } catch (error) {
        console.error('Error fetching status:', error);
      }
    };

    const startInterval = (intervalTime: number) => {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(manageFetch, intervalTime);
    };

    const initialTimeout = setTimeout(() => {
      let intervalTime;
      if (status.status === 'STOPPED') {
        intervalTime = 30000;
      } else {
        const now = Date.now();
        const stopTime = new Date(status.taskStoppedAt).getTime();
        const timeLeft = Math.max(stopTime - now, 0);
        intervalTime = Math.max(timeLeft / 10, 10000);
      }
      startInterval(intervalTime);
    }, 10000);

    return () => {
      if (intervalId) clearInterval(intervalId);
      clearTimeout(initialTimeout);
    };
  }, [
    statusState.signIn.status,
    status.status,
    status.taskStoppedAt,
    ephemeral,
  ]);

  const formattedCountdown = useMemo(() => {
    if (countdown === null) return '';
    const minutes = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countdown % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s`;
  }, [countdown]);

  const countdownColor = useMemo(() => {
    if (countdown === null) return 'text-gray-400';
    const minutes = Math.floor(countdown / (1000 * 60));
    if (status.status === 'STOPPED') return 'text-gray-400';
    if (minutes < 2) return 'text-red-400';
    if (minutes < 5) return 'text-yellow-400';
    return 'text-green-400';
  }, [countdown, status.status]);

  const handleStart = useCallback(
    async ({ interval }: { interval: number }) => {
      setIsStarting(true);
      try {
        await mutateAsync();
        await ephemeral.handleStart({ interval });
      } finally {
        setIsStarting(false);
      }
    },
    [ephemeral, mutateAsync],
  );

  const handleStop = useCallback(async () => {
    setIsStopping(true);
    try {
      await mutateAsync();
      await ephemeral.handleStop();
    } finally {
      setIsStopping(false);
    }
  }, [ephemeral, mutateAsync]);

  const value = useMemo(
    () => ({
      ...ephemeral,
      handleStart,
      handleStop,
      status,
      countdown: {
        formattedCountdown,
        countdown,
        countdownColor,
      },
      loading,
      isStarting,
      isStopping,
    }),
    [
      ephemeral,
      handleStart,
      handleStop,
      status,
      formattedCountdown,
      countdown,
      countdownColor,
      loading,
      isStarting,
      isStopping,
    ],
  );

  return (
    <EphemeralContext.Provider value={value}>
      {children}
    </EphemeralContext.Provider>
  );
};

export { EphemeralContext };
