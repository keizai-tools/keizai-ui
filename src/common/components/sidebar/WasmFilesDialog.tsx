import { Fragment, useEffect, useState } from 'react';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

import {
  useDownloadWasmFileQuery,
  useWasmFilesQuery,
} from '@/common/api/invocations';

interface WasmFilesDialogProps {
  open: boolean;
  onOpenChange: () => void;
}

function WasmFilesDialog({
  open,
  onOpenChange,
}: Readonly<WasmFilesDialogProps>) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const { data, isLoading, isError } = useWasmFilesQuery();
  const {
    data: fileData,
    isLoading: isFileLoading,
    isError: isFileError,
  } = useDownloadWasmFileQuery(
    selectedFile ? { fileName: selectedFile } : { fileName: '' },
  );

  useEffect(() => {
    if (fileData) {
      const blob = new Blob([fileData.file], { type: 'application/wasm' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileData.name || 'download.wasm';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    }
  }, [fileData, selectedFile]);

  return (
    <Fragment>
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
              Wasm Files List
            </DialogTitle>
            <DialogDescription
              data-test="import-account-modal-description"
              className="text-sm select-none"
            >
              {isLoading || isFileLoading ? (
                <div>Loading...</div>
              ) : isError || isFileError ? (
                <div>Error loading files</div>
              ) : data && data.length > 0 ? (
                <div>
                  {data.map(
                    (file) =>
                      file && (
                        <div
                          key={file.id}
                          className="flex flex-col items-start justify-between w-full h-full gap-4 p-6 font-bold border-2 border-solid rounded-lg border-offset-background bg-slate-900"
                        >
                          <div className="flex items-baseline justify-between w-full h-full">
                            <p className="flex items-center text-lg pointer-events-none">
                              {file.id}
                            </p>
                            <Button
                              onClick={() => setSelectedFile(file.id)}
                              variant="outline"
                              className="w-auto px-8 py-3 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            >
                              Download
                            </Button>
                          </div>
                        </div>
                      ),
                  )}
                </div>
              ) : (
                <div>No files available</div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

export default WasmFilesDialog;
