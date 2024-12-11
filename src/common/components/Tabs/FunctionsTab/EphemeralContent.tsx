import { Fragment } from 'react';

import ErrorMessage from '../../Form/ErrorMessage';
import { Button } from '../../ui/button';
import { type FileData, CustomDragDrop } from './DragAndDropContainer';

export default function EphemeralContent({
  files,
  uploadFiles,
  deleteFile,
  error,
  status,
  handleStart,
  handleStop,
  loading,
  handleButtonClick,
  buttonLabel,
  setEphemeral,
}: Readonly<{
  files: FileData[];
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
          <Button
            type="submit"
            className="px-4 py-2 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105"
            data-test="edit-entity-dialog-btn-submit"
            onClick={() => handleStart({ interval: 10 })}
            disabled={loading}
          >
            {loading ? 'Starting...' : 'Start Ephemeral'}
          </Button>
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
    </Fragment>
  );
}
