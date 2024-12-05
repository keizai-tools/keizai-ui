import { useState, useEffect, useCallback, useMemo } from 'react';

import { FileData } from '../components/Tabs/FunctionsTab/DragAndDropContainer';
import { useToast, type ToasterToast } from '../components/ui/use-toast';
import useNetwork from './useNetwork';

import {
  usePrepareUploadWasmMutation,
  useRunUploadWasmMutation,
  useUploadWasmMutation,
} from '@/common/api/invocations';
import useEphemeral from '@/common/hooks/useEphemeral';
import { Invocation } from '@/common/types/invocation';
import { NETWORK } from '@/common/types/soroban.enum';
import { IApiResponseError } from '@/config/axios/interfaces/IApiResponseError';
import { IWallet } from '@/modules/auth/interfaces/IAuthenticationContext';
import useInvocation from '@/modules/invocation/hooks/useInvocation';
import signTransaction from '@/modules/signer/functions/signTransaction';

export default function useWasmFileHandler(
  data: Invocation,
  wallet: IWallet,
  setLoading: (loading: boolean) => void,
  connectWallet: (network: Partial<NETWORK>) => Promise<void>,
  loading: boolean,
) {
  const [files, setFiles] = useState<FileData[]>([]);
  const [signedTransactionXDR, setSignedTransactionXDR] = useState<
    string | null
  >(null);
  const [isEphemeral, setIsEphemeral] = useState<boolean>(false);
  const [network, setNetwork] = useState<NETWORK>(data.network);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleStart, handleStop, isLoading, status } = useEphemeral();
  const uploadWasmMutation = useUploadWasmMutation();
  const prepareUploadMutation = usePrepareUploadWasmMutation();
  const runUploadWasmMutation = useRunUploadWasmMutation();
  const { toast } = useToast();
  const { handleUpdateNetwork } = useNetwork(false);
  const {
    handleLoadContract,
    isLoadingContract,
    contractResponses,
    handleRunInvocation,
    isRunningInvocation,
  } = useInvocation(data, wallet, connectWallet);

  const preInvocationValue = useMemo(() => {
    return data.preInvocation ?? '';
  }, [data]);

  const postInvocationValue = useMemo(() => {
    return data.postInvocation ?? '';
  }, [data]);

  const handleNetworkUpdate = useCallback(
    (network: NETWORK) => {
      handleUpdateNetwork(network);
      setIsModalOpen(network !== NETWORK.AUTO_DETECT);
    },
    [handleUpdateNetwork],
  );

  const handleOpenUploadWasmModal = useCallback(() => {
    if (data.network === NETWORK.AUTO_DETECT)
      handleNetworkUpdate(NETWORK.SOROBAN_FUTURENET);
    else setIsModalOpen(true);
  }, [data.network, handleNetworkUpdate]);

  const handleCloseModal = useCallback(() => {
    handleNetworkUpdate(NETWORK.AUTO_DETECT);
  }, [handleNetworkUpdate]);

  useEffect(() => {
    if (data.contractId && loading) setLoading(false);
  }, [data, loading, setLoading]);

  useEffect(() => {
    if (
      !data.contractId &&
      !isModalOpen &&
      data.network !== NETWORK.AUTO_DETECT
    ) {
      handleNetworkUpdate(NETWORK.AUTO_DETECT);
    }
  }, [data.contractId, data.network, handleNetworkUpdate, isModalOpen]);

  useEffect(() => {
    if (data.contractId && loading) setLoading(false);
  }, [data, loading, setLoading]);

  const resetNetworkState = useCallback(() => {
    const shouldSetEphemeral = status?.status === 'RUNNING';
    if (shouldSetEphemeral && !data.contractId) {
      setNetwork((prevNetwork) => {
        const newNetwork = shouldSetEphemeral
          ? NETWORK.EPHEMERAL
          : data.network;
        if (prevNetwork !== newNetwork) {
          setSignedTransactionXDR(null);
          setError(null);
          setIsEphemeral(shouldSetEphemeral);
          handleOpenUploadWasmModal();
          return newNetwork;
        }
        return prevNetwork;
      });
    }
  }, [
    status?.status,
    data.contractId,
    data.network,
    handleOpenUploadWasmModal,
  ]);

  useEffect(() => {
    resetNetworkState();
  }, [resetNetworkState]);

  function resetState() {
    setFiles([]);
    setSignedTransactionXDR(null);
    setError(null);
  }

  function uploadFiles(f: FileData[]) {
    setFiles((prevFiles) => [...prevFiles, ...f]);
    setSignedTransactionXDR(null);
  }

  function deleteFile(indexFile: number) {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexFile),
    );
    setSignedTransactionXDR(null);
  }

  async function handleUploadWasm() {
    if (files.length === 0) return;
    setLoading(true);
    try {
      const contractId = await uploadWasm();
      handleLoadContract(contractId);
      showToast(
        'Wasm file uploaded',
        'The Wasm file of the contract has been deployed successfully',
      );
    } catch (error) {
      handleError(error, 'Failed to upload Wasm file');
    } finally {
      setLoading(false);
    }
  }

  async function uploadWasm() {
    const { file, name } = files[0];
    const formData = new FormData();
    formData.append('wasm', file, name);
    return await uploadWasmMutation.mutateAsync({ formData, id: data.id });
  }

  async function handlePrepareUpload() {
    if (files.length === 0) return;
    setLoading(true);
    try {
      const signedTransaction = await prepareUpload();
      setSignedTransactionXDR(signedTransaction);
    } catch (error) {
      handleError(error, 'Failed to prepare deployer contract');
    } finally {
      setLoading(false);
    }
  }

  async function prepareUpload() {
    const { file, name } = files[0];
    const formData = new FormData();
    formData.append('wasm', file, name);
    const { payload } = await prepareUploadMutation.mutateAsync({
      formData,
      id: data.id,
    });
    return await signTransaction(payload, data.network);
  }

  async function handleRunUploadWasm() {
    if (!signedTransactionXDR) return;
    setLoading(true);
    try {
      const newContractId = await runUploadWasm();
      handleLoadContract(newContractId as string);
      showToast(
        'Wasm file uploaded',
        'The Wasm file of the contract has been deployed successfully',
      );
    } catch (error) {
      handleError(error, 'Failed to run deployer contract');
    } finally {
      setLoading(false);
    }
  }

  async function runUploadWasm() {
    const signedContract = await runUploadWasmMutation.mutateAsync({
      id: data.id,
      signedTransactionXDR: signedTransactionXDR as string,
      deploy: false,
    });
    const signedTransaction = await signTransaction(
      signedContract as string,
      data.network,
    );
    return await runUploadWasmMutation.mutateAsync({
      id: data.id,
      signedTransactionXDR: signedTransaction as string,
      deploy: true,
    });
  }

  function handleError(error: unknown, defaultMessage: string) {
    const { details } = error as IApiResponseError;
    const description = details?.description || '';
    const contractExists = description.includes('ExistingValue');
    const accountNotFound = description.includes('Account not found:');
    let message: string;

    if (Array.isArray(description)) {
      message = description.join(', ');
    } else if (accountNotFound) {
      message =
        'The account was not found. Please ensure the account is funded first.';
    } else if (contractExists) {
      const contractName =
        description.split('contract:')[1]?.split(',')[0]?.trim() ?? '';
      message = `The contract already has a Wasm file. ${contractName}`;
    } else {
      message = description;
    }

    if (!contractExists && !accountNotFound) {
      showToast(defaultMessage, message, 'destructive');
    } else {
      setError(message);
    }
    setLoading(false);
    setSignedTransactionXDR(null);
  }

  function showToast(
    title: string,
    description: string,
    variant: ToasterToast['variant'] = 'default',
  ) {
    toast({ title, description, variant });
  }

  function handleButtonClick() {
    setError(null);
    if (!wallet[data.network as keyof typeof wallet]) {
      signedTransactionXDR ? handleRunUploadWasm() : handlePrepareUpload();
    } else {
      handleUploadWasm();
    }
  }

  return {
    files,
    signedTransactionXDR,
    network,
    error,
    isLoading,
    status,
    handleStart,
    handleStop,
    uploadFiles,
    deleteFile,
    handleButtonClick,
    resetState,
    isEphemeral,
    setIsEphemeral,
    isLoadingContract,
    contractResponses,
    handleRunInvocation,
    isRunningInvocation,
    preInvocationValue,
    postInvocationValue,
    handleOpenUploadWasmModal,
    handleCloseModal,
    handleLoadContract,
    isModalOpen,
  };
}
