import React, { Fragment } from 'react';

import ErrorMessage from '../../Form/ErrorMessage';
import SelectNetwork from '../../Input/SelectNetwork';
import { Button } from '../../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { useToast } from '../../ui/use-toast';
import { CustomDragDrop, FileData } from './DragAndDropContainer';

import {
  usePrepareUploadWasmMutation,
  useRunUploadWasmMutation,
  useUploadWasmMutation,
} from '@/common/api/invocations';
import { Invocation } from '@/common/types/invocation';
import { BACKEND_NETWORK, type NETWORK } from '@/common/types/soroban.enum';
import OverlayLoading from '@/common/views/OverlayLoading';
import { IApiResponseError } from '@/config/axios/interfaces/IApiResponseError';
import { IWalletContent } from '@/modules/auth/interfaces/IAuthenticationContext';
import signTransaction from '@/modules/signer/functions/signTransaction';

interface UploadWasmDialogProps {
  open: boolean;
  onOpenChange: () => void;
  data: Invocation;
  handleLoadContract: (contractId: string) => void;
  wallet: IWalletContent | null;
  setLoading: (loading: boolean) => void;
  loading: boolean;
}
function UploadWasmDialog({
  open,
  onOpenChange,
  data,
  handleLoadContract,
  wallet,
  setLoading,
  loading,
}: Readonly<UploadWasmDialogProps>) {
  const [files, setFiles] = React.useState<FileData[]>([]);
  const [signedTransactionXDR, setSignedTransactionXDR] = React.useState<
    string | null
  >(null);

  const [error, setError] = React.useState<string | null>(null);

  const uploadWasmMutation = useUploadWasmMutation();
  const prepareUploadMutation = usePrepareUploadWasmMutation();
  const runUploadWasmMutation = useRunUploadWasmMutation();

  const { toast } = useToast();

  function uploadFiles(f: FileData[]) {
    setFiles([...files, ...f]);
    setSignedTransactionXDR(null);
  }

  function deleteFile(indexFile: number) {
    const updatedList = files.filter((_, index) => index !== indexFile);
    setFiles(updatedList);
    setSignedTransactionXDR(null);
  }

  async function handleUploadWasm() {
    if (files.length === 0) return;

    setLoading(true);

    try {
      const { file, name } = files[0];
      const formData = new FormData();
      formData.append('wasm', file, name);

      const contractId = await uploadWasmMutation.mutateAsync({
        formData,
        id: data.id,
      });

      handleLoadContract(contractId);
      toast({
        title: 'Wasm file uploaded',
        description:
          'The Wasm file of the contract has been deployed successfully',
      });
    } catch (error) {
      const { details } = error as IApiResponseError;
      toast({
        title: 'Failed to upload Wasm file',
        description: details.description,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handlePrepareUpload() {
    if (files.length === 0) return;

    setLoading(true);

    try {
      const { file, name } = files[0];
      const formData = new FormData();
      formData.append('wasm', file, name);

      const { payload } = await prepareUploadMutation.mutateAsync({
        formData,
        id: data.id,
      });

      const signedTransaction = await signTransaction(
        payload,
        data.network as unknown as NETWORK,
      );

      setSignedTransactionXDR(signedTransaction);
    } catch (error) {
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
        toast({
          title: 'Failed to prepare deployer contract',
          description: message,
          variant: 'destructive',
        });
      } else {
        setError(message);
      }
      setLoading(false);
      setError(message);
      setSignedTransactionXDR(null);
    }
  }
  async function handleRunUploadWasm() {
    if (!signedTransactionXDR || signedTransactionXDR.length === 0) return;

    setLoading(true);
    console.log('signedTransactionXDR', signedTransactionXDR);

    try {
      const signedContract = await runUploadWasmMutation.mutateAsync({
        id: data.id,
        signedTransactionXDR,
        deploy: false,
      });

      const signedTransaction = await signTransaction(
        signedContract as string,
        data.network as unknown as NETWORK,
      );

      const newContractId = await runUploadWasmMutation.mutateAsync({
        id: data.id,
        signedTransactionXDR: signedTransaction as string,
        deploy: true,
      });

      handleLoadContract(newContractId as string);
      toast({
        title: 'Wasm file uploaded',
        description:
          'The Wasm file of the contract has been deployed successfully',
      });
    } catch (error) {
      const { details } = error as IApiResponseError;
      const message = details?.description || 'An unexpected error occurred';

      toast({
        title: 'Failed to run deployer contract',
        description: message,
        variant: 'destructive',
      });
      setSignedTransactionXDR(null);
      setLoading(false);
      setError(typeof message === 'string' ? message : message.join(', '));
    }
  }

  function handleButtonClick() {
    if (!wallet?.autoGenerated) {
      if (signedTransactionXDR) {
        handleRunUploadWasm();
      } else {
        handlePrepareUpload();
      }
    } else {
      handleUploadWasm();
    }
  }

  React.useEffect(() => {
    if (!open) {
      setFiles([]);
      setSignedTransactionXDR(null);
      setError(null);
    }
  }, [open]);

  const loadingLocal =
    uploadWasmMutation.isPending ||
    prepareUploadMutation.isPending ||
    runUploadWasmMutation.isPending ||
    loading;

  let buttonLabel;
  if (signedTransactionXDR) {
    buttonLabel = 'Load';
  } else if (!wallet?.autoGenerated) {
    buttonLabel = 'Prepare';
  } else {
    buttonLabel = 'Load';
  }

  return (
    <Fragment>
      {loadingLocal ? (
        <OverlayLoading />
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent
            data-test="import-account-modal-container"
            className="min-w-fit"
          >
            <DialogHeader>
              <DialogTitle
                data-test="import-account-modal-title"
                className="text-lg select-none"
              >
                Wasm Upload
              </DialogTitle>
              <DialogDescription
                data-test="import-account-modal-description"
                className="text-sm select-none"
              >
                Please upload the WASM file of the contract
              </DialogDescription>
            </DialogHeader>
            <CustomDragDrop
              ownerLicense={files}
              onUpload={uploadFiles}
              onDelete={deleteFile}
              count={1}
              formats={['wasm']}
            />
            {error && (
              <ErrorMessage
                message={error}
                testName="import-account-modal-error"
                styles="text-sm align-middle"
              />
            )}

            <DialogFooter className="mt-2">
              <div className="flex items-center justify-between w-full">
                <div>
                  {data.network !== BACKEND_NETWORK.AUTO_DETECT && (
                    <SelectNetwork network={data.network} />
                  )}
                </div>
                <div className="flex items-center justify-between gap-2">
                  {files.length > 0 && (
                    <Button
                      type="submit"
                      className="px-4 py-2 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105"
                      data-test="edit-entity-dialog-btn-submit"
                      onClick={handleButtonClick}
                    >
                      {buttonLabel}
                    </Button>
                  )}

                  <Button
                    type="submit"
                    className="px-4 py-2 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105"
                    variant="outline"
                    data-test="edit-entity-dialog-btn-submit"
                    onClick={onOpenChange}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Fragment>
  );
}

export default UploadWasmDialog;
