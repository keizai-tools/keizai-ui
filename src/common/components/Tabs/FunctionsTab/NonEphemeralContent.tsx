import { Fragment } from 'react';

import ErrorMessage from '../../Form/ErrorMessage';
import SelectNetwork from '../../Input/SelectNetwork';
import { Button } from '../../ui/button';
import { DialogFooter } from '../../ui/dialog';
import { type FileData, CustomDragDrop } from './DragAndDropContainer';

import type { Invocation } from '@/common/types/invocation';
import { NETWORK } from '@/common/types/soroban.enum';

export default function NonEphemeralContent({
  files,
  uploadFiles,
  deleteFile,
  error,
  data,
  setIsEphemeral,
  handleButtonClick,
  buttonLabel,
  onOpenChange,
}: Readonly<{
  files: FileData[];
  uploadFiles: (f: FileData[]) => void;
  deleteFile: (indexFile: number) => void;
  error: string | null;
  data: Invocation;
  setIsEphemeral: React.Dispatch<React.SetStateAction<boolean>>;
  handleButtonClick: () => void;
  buttonLabel: string;
  onOpenChange: () => void;
}>) {
  return (
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
          styles="text-sm align-middle"
        />
      )}
      <DialogFooter className="mt-2">
        <div className="flex items-center justify-between w-full">
          <div>
            {data.network !== NETWORK.AUTO_DETECT && (
              <SelectNetwork
                setEphemeral={setIsEphemeral}
                network={data.network}
              />
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
    </Fragment>
  );
}
