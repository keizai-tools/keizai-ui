import { Fragment, useEffect, useState } from 'react';

import ErrorMessage from '../../Form/ErrorMessage';
import SelectInterval from '../../Input/SelectInterval';
import SelectNetwork from '../../Input/SelectNetwork';
import SelectWasmFile from '../../Input/selectWasmFile';
import ConnectWalletDialog from '../../connectWallet/connectWalletDialog';
import { Button } from '../../ui/button';
import { type FileData, CustomDragDrop } from './DragAndDropContainer';

import { useWasmFilesQuery } from '@/common/api/invocations';
import { Invocation } from '@/common/types/invocation';
import { NETWORK } from '@/common/types/soroban.enum';
import { StoredCookies } from '@/modules/cookies/interfaces/cookies.enum';
import { cookieService } from '@/modules/cookies/services/cookie.service';
import { userService } from '@/modules/user/services/user.service';

export default function EphemeralContent({
  files,
  uploadFiles,
  deleteFile,
  error,
  status,
  data,
  handleStart,
  handleStop,
  loading,
  handleButtonClick,
  buttonLabel,
  setEphemeral,
}: Readonly<{
  files: FileData[];
  data: Invocation;
  uploadFiles: (f: FileData[]) => void;
  deleteFile: (indexFile: number) => void;
  error: string | null;
  status?: {
    status: string;
    taskArn: string;
    publicIp: string;
    isEphemeral: boolean;
  };
  handleStart: (options: { interval: number }) => void;
  handleStop: () => void;
  loading: boolean;
  handleButtonClick: () => void;
  buttonLabel: string;
  setEphemeral: (status: boolean) => void;
}>) {
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [balance, setBalance] = useState<number>(0);
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState<number | null>(null);

  useEffect(() => {
    async function fetchBalance() {
      const response = await userService.UserMe();
      setBalance(response.payload.balance);
    }
    fetchBalance();
  }, []);

  const {
    data: wasmFiles = [],
    error: wasmFilesError,
    isLoading: wasmFilesLoading,
  } = useWasmFilesQuery({ invocationId: data.id });

  if (balance <= 0) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-lg font-bold text-red-500">
          You do not have a sufficient balance for the ephemeral environment.
        </p>
        <Button
          type="button"
          className="px-4 py-2 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105"
          onClick={() => setIsWalletDialogOpen(true)}
        >
          Recharge Balance
        </Button>
        {isWalletDialogOpen && (
          <ConnectWalletDialog
            open={isWalletDialogOpen}
            onOpenChange={(open) => setIsWalletDialogOpen(open)}
          />
        )}
        {data.network !== NETWORK.AUTO_DETECT && (
          <SelectNetwork setEphemeral={setEphemeral} network={data.network} />
        )}
      </div>
    );
  }

  const handleStartClick = async () => {
    if (selectedInterval !== null) {
      try {
        const userId = cookieService.getCookie(StoredCookies.USER_ID);
        if (userId === undefined) {
          console.error('User ID cookie not found');
          return;
        }
        await userService.updateUserBalance(userId, selectedInterval);
        handleStart({ interval: selectedInterval });
      } catch (error) {
        console.error('Error updating user balance:', error);
      }
    }
  };

  return (
    <Fragment>
      {status?.status === 'RUNNING' && (
        <Fragment>
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
              styles="text-sm text-red-500"
            />
          )}
          {wasmFilesLoading ? (
            <p>Loading available Wasm files...</p>
          ) : wasmFilesError ? (
            <p>Error loading files: {wasmFilesError.message}</p>
          ) : (
            <SelectWasmFile
              wasmFiles={wasmFiles}
              selectedFile={selectedFile}
              onFileChange={(file) => {
                setSelectedFile(file);
              }}
            />
          )}
        </Fragment>
      )}

      <div className="flex flex-col w-full h-full gap-6 p-6 font-bold border-2 border-solid rounded-lg border-offset-background bg-slate-900">
        <div className="flex items-center justify-between w-full gap-2">
          <span className="text-base text-gray-500 ">Ephemeral Status:</span>
          <span
            className={`text-sm ${
              status?.status === 'STOPPED' ? 'text-red-500' : 'text-green-500'
            }`}
          >
            {status?.status}
          </span>
        </div>
      </div>
      {status?.publicIp && (
        <div className="flex flex-col w-full h-full gap-6 p-6 font-bold border-2 border-solid rounded-lg border-offset-background bg-slate-900">
          <div className="flex items-center justify-between w-full gap-2">
            <span className="text-base text-gray-500 ">IP Address:</span>
            <span className="ml-2 text-sm text-gray-500">
              {status?.publicIp}
            </span>
          </div>
        </div>
      )}
      <div className="flex flex-row items-center justify-between w-full gap-4">
        <Button
          type="submit"
          className="px-4 py-2 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105"
          variant="outline"
          data-test="edit-entity-dialog-btn-submit"
          onClick={() => {
            files.flatMap((_file, index) => deleteFile(index));
            setEphemeral(false);
          }}
        >
          Cancel
        </Button>
        {status?.status === 'STOPPED' ? (
          <>
            <SelectInterval
              interval={selectedInterval}
              setInterval={setSelectedInterval}
            />
            <Button
              type="submit"
              className="px-4 py-2 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105"
              data-test="edit-entity-dialog-btn-submit"
              onClick={handleStartClick}
              disabled={loading || selectedInterval === null}
            >
              {loading ? 'Starting...' : 'Start Ephemeral'}
            </Button>
          </>
        ) : (
          <Button
            type="submit"
            className="px-4 py-2 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105"
            variant="outline"
            data-test="edit-entity-dialog-btn-submit"
            onClick={() => {
              files.flatMap((_file, index) => deleteFile(index));
              handleStop();
            }}
            disabled={loading}
          >
            {loading ? 'Stopping...' : 'Stop Ephemeral'}
          </Button>
        )}
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
      </div>
      {data.network !== NETWORK.AUTO_DETECT && (
        <SelectNetwork setEphemeral={setEphemeral} network={data.network} />
      )}
    </Fragment>
  );
}
