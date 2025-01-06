import { createContext, ReactNode, useMemo, useState } from 'react';

import { useEphemeral as useEphemeralHook } from '../hooks/useEphemeral';

interface EphemeralContextType {
  loading: boolean;
  status: {
    status: string;
    taskArn: string;
    publicIp: string;
    isEphemeral: boolean;
  };
  handleStart: ({ interval }: { interval: number }) => Promise<void>;
  handleStop: () => Promise<void>;
  isError: boolean;
  isLoading: boolean;
  fetchStatus: () => Promise<void>;
  setEphemeral: (variable: boolean) => void;
}

const EphemeralContext = createContext<EphemeralContextType | null>(null);

interface EphemeralProviderProps {
  children: ReactNode;
}

export const EphemeralProvider = ({ children }: EphemeralProviderProps) => {
  const [loading, setLoading] = useState(false);
  const ephemeral = useEphemeralHook(setLoading);
  const value = useMemo(
    () => ({ ...ephemeral, loading }),
    [ephemeral, loading],
  );

  return (
    <EphemeralContext.Provider value={value}>
      {children}
    </EphemeralContext.Provider>
  );
};

export { EphemeralContext };
