import { useContext } from 'react';

import { EphemeralContext } from './EphemeralContext';

export function useEphemeralProvider() {
  const context = useContext(EphemeralContext);
  if (!context)
    throw new Error(
      'useEphemeralProvider must be used within an EphemeralProvider',
    );
  return context;
}
