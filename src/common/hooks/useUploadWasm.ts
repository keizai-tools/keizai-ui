import { useEffect, useMemo } from 'react';

import { useEphemeral as useEphemeralHandlers } from './useEphemeral';
import { useFileHandlers } from './useFileHandler';
import useNetwork from './useNetwork';
import { useNetworkHandlers } from './useNetworkHandlers';
import { useUploadHandlers } from './useUploadHandler';

import { Invocation } from '@/common/types/invocation';
import { NETWORK } from '@/common/types/soroban.enum';
import { IWallet } from '@/modules/auth/interfaces/IAuthenticationContext';
import useInvocationHandlers from '@/modules/invocation/hooks/useInvocation';

export default function useWasmFileHandler(
  data: Invocation,
  wallet: IWallet,
  setLoading: (loading: boolean) => void,
  connectWallet: (network: Partial<NETWORK>) => Promise<void>,
) {
  const { handleUpdateNetwork } = useNetwork(false);
  const FileHandler = useFileHandlers();

  const NetworkHandler = useNetworkHandlers(data, handleUpdateNetwork);

  const UploadHandler = useUploadHandlers({
    data,
    wallet,
    setLoading,
    connectWallet,
    files: FileHandler.files,
    signedTransactionXDR: FileHandler.signedTransactionXDR,
    setSignedTransactionXDR: FileHandler.setSignedTransactionXDR,
    setError: FileHandler.setError,
  });

  const EphemeralHandlers = useEphemeralHandlers(setLoading);

  const InvocationHandlers = useInvocationHandlers(data, wallet, connectWallet);

  const preInvocationValue = useMemo(() => data.preInvocation ?? '', [data]);
  const postInvocationValue = useMemo(() => data.postInvocation ?? '', [data]);

  useEffect(() => {
    if (
      !data.contractId &&
      !NetworkHandler.isModalOpen &&
      data.network !== NETWORK.AUTO_DETECT &&
      !EphemeralHandlers.status.isEphemeral
    ) {
      handleUpdateNetwork(NETWORK.AUTO_DETECT);
    }
  }, [
    EphemeralHandlers.status.isEphemeral,
    NetworkHandler.isModalOpen,
    data.contractId,
    data.network,
    handleUpdateNetwork,
  ]);

  return {
    ...FileHandler,
    ...UploadHandler,
    ...InvocationHandlers,
    ...NetworkHandler,
    ...EphemeralHandlers,
    preInvocationValue,
    postInvocationValue,
  };
}
