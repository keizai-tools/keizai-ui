import { useCallback } from 'react';

import {
  useUploadWasmMutation,
  usePrepareUploadWasmMutation,
  useRunUploadWasmMutation,
} from '../api/invocations';
import { FileData } from '../components/Tabs/FunctionsTab/DragAndDropContainer';
import { useToast, ToasterToast } from '../components/ui/use-toast';
import { Invocation } from '../types/invocation';
import { NETWORK } from '../types/soroban.enum';

import { IApiResponseError } from '@/config/axios/interfaces/IApiResponseError';
import { IWallet } from '@/modules/auth/interfaces/IAuthenticationContext';
import useInvocationHandlers from '@/modules/invocation/hooks/useInvocation';
import signTransaction from '@/modules/signer/functions/signTransaction';

type UploadHandlerParams = {
  data: Invocation;
  wallet: IWallet;
  setLoading: (loading: boolean) => void;
  connectWallet: (network: Partial<NETWORK>) => Promise<void>;
  files: FileData[];
  signedTransactionXDR: string | null;
  setSignedTransactionXDR: (xdr: string | null) => void;
  setError: (error: string | null) => void;
};

export function useUploadHandlers({
  data,
  wallet,
  setLoading,
  connectWallet,
  files,
  signedTransactionXDR,
  setSignedTransactionXDR,
  setError,
}: UploadHandlerParams) {
  const uploadWasmMutation = useUploadWasmMutation();
  const prepareUploadMutation = usePrepareUploadWasmMutation();
  const runUploadWasmMutation = useRunUploadWasmMutation();
  const { toast } = useToast();
  const { handleLoadContract } = useInvocationHandlers(
    data,
    wallet,
    connectWallet,
  );

  const showToast = useCallback(
    (
      title: string,
      description: string,
      variant: ToasterToast['variant'] = 'default',
    ): void => {
      toast({ title, description, variant });
    },
    [toast],
  );

  const handleError = useCallback(
    (error: unknown, defaultMessage: string): void => {
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
    },
    [setError, setLoading, setSignedTransactionXDR, showToast],
  );

  const createFormData = (fileData: FileData): FormData => {
    const formData = new FormData();
    formData.append('wasm', fileData.file, fileData.name);
    return formData;
  };

  const uploadWasm = useCallback(async (): Promise<string> => {
    const formData = createFormData(files[0]);
    return await uploadWasmMutation.mutateAsync({ formData, id: data.id });
  }, [files, uploadWasmMutation, data.id]);

  const handleUploadWasm = useCallback(async (): Promise<void> => {
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
  }, [
    files,
    setLoading,
    uploadWasm,
    handleLoadContract,
    showToast,
    handleError,
  ]);

  async function prepareUpload() {
    setLoading(true);
    try {
      const { file, name } = files[0];
      const formData = new FormData();
      formData.append('wasm', file, name);
      const { payload } = await prepareUploadMutation.mutateAsync({
        formData,
        id: data.id,
      });
      return await signTransaction(payload, data.network);
    } catch (error) {
      handleError(error, 'Failed to prepare deployer contract');
      throw error;
    } finally {
      setLoading(false);
    }
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

  async function runUploadWasm() {
    setLoading(true);
    try {
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
    } catch (error) {
      handleError(error, 'Failed to run deployer contract');
      throw error;
    } finally {
      setLoading(false);
    }
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

  function handleButtonClick() {
    setError(null);
    if (!wallet[data.network as keyof typeof wallet]?.autoGenerated) {
      signedTransactionXDR ? handleRunUploadWasm() : handlePrepareUpload();
    } else {
      handleUploadWasm();
    }
  }
  return {
    handleUploadWasm,
    handlePrepareUpload,
    handleRunUploadWasm,
    handleButtonClick,
  };
}
