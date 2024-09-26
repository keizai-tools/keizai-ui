import React from 'react';

import useEnvironments from '@/common/hooks/useEnvironments';
import { Environment } from '@/common/types/environment';

type EnvironmentContextType = Environment[] | [];

export const EnvironmentContext = React.createContext<EnvironmentContextType>(
  [],
);

export function EnvironmentProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { environments } = useEnvironments();

  return (
    <EnvironmentContext.Provider value={environments}>
      {children}
    </EnvironmentContext.Provider>
  );
}
