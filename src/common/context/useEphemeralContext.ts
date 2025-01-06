import { useContext } from 'react';

import { EphemeralContext } from './EphemeralContext';

export const useEphemeral = () => {
  return useContext(EphemeralContext);
};
