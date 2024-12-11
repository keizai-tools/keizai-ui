import { useState, useCallback } from 'react';

import { Invocation } from '../types/invocation';
import { NETWORK } from '../types/soroban.enum';

export function useNetworkHandlers(
  data: Invocation,
  handleUpdateNetwork: (network: NETWORK) => void,
) {
  const [network, setNetwork] = useState<NETWORK>(data.network);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleNetworkUpdate = useCallback(
    (network: NETWORK): void => {
      handleUpdateNetwork(network);
      setIsModalOpen(network !== NETWORK.AUTO_DETECT);
    },
    [handleUpdateNetwork],
  );

  const handleOpenUploadWasmModal = useCallback((): void => {
    if (data.network === NETWORK.AUTO_DETECT)
      handleNetworkUpdate(NETWORK.SOROBAN_FUTURENET);
    else setIsModalOpen(true);
  }, [data.network, handleNetworkUpdate]);

  const handleCloseModal = useCallback((): void => {
    handleNetworkUpdate(NETWORK.AUTO_DETECT);
  }, [handleNetworkUpdate]);

  return {
    network,
    isModalOpen,
    handleNetworkUpdate,
    handleOpenUploadWasmModal,
    handleCloseModal,
    setNetwork,
  };
}
