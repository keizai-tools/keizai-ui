import { useState, useCallback } from 'react';

import { FileData } from '../components/Tabs/FunctionsTab/DragAndDropContainer';

export function useFileHandlers() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [signedTransactionXDR, setSignedTransactionXDR] = useState<
    string | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const resetState = useCallback((): void => {
    setFiles([]);
    setSignedTransactionXDR(null);
    setError(null);
  }, []);

  const uploadFiles = useCallback((f: FileData[]): void => {
    setFiles((prevFiles) => [...prevFiles, ...f]);
    setSignedTransactionXDR(null);
  }, []);

  const deleteFile = useCallback((indexFile: number): void => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexFile),
    );
    setSignedTransactionXDR(null);
  }, []);

  return {
    files,
    signedTransactionXDR,
    error,
    resetState,
    uploadFiles,
    deleteFile,
    setSignedTransactionXDR,
    setError,
  };
}
