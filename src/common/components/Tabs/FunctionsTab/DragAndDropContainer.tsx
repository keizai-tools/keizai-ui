import { FileText, Upload, X } from 'lucide-react';
import React, { useRef, useEffect, useState, useCallback } from 'react';

import { useToast } from '@/common/components/ui/use-toast';
import { truncateFileName } from '@/lib/utils';

export interface FileData {
  name: string;
  file: File;
  type: string;
  size: number;
}

interface CustomDragDropProps {
  ownerLicense: FileData[];
  onUpload: (files: FileData[]) => void;
  onDelete: (index: number) => void;
  count: number;
  formats: string[];
}

export function CustomDragDrop({
  ownerLicense,
  onUpload,
  onDelete,
  count,
  formats,
}: Readonly<CustomDragDropProps>) {
  const dropContainer = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const { toast } = useToast();

  const showAlert = useCallback(
    (title: string, text: string) => {
      toast({
        title,
        description: text,
        variant: 'destructive',
      });
    },
    [toast],
  );

  const handleDrop = useCallback(
    (
      e:
        | React.DragEvent<HTMLDivElement>
        | DragEvent
        | React.ChangeEvent<HTMLInputElement>,
      type: string,
    ) => {
      let files: File[];

      if (type === 'inputFile') {
        if (e.target instanceof HTMLInputElement && e.target.files) {
          files = Array.from(e.target.files);
        } else {
          return;
        }
      } else {
        if (e instanceof DragEvent && e.dataTransfer) {
          e.preventDefault();
          e.stopPropagation();
          setDragging(false);
          files = Array.from(e.dataTransfer.files);
        } else {
          return;
        }
      }

      const allFilesValid = files.every((file) => {
        return formats.some((format) => file.type.endsWith(`/${format}`));
      });

      if (ownerLicense.length >= count) {
        showAlert('Maximum Files', `Only ${count} files can be uploaded`);
        return;
      }
      if (!allFilesValid) {
        showAlert(
          'Invalid Media',
          `Invalid file format. Please only upload ${formats
            .join(', ')
            .toUpperCase()}`,
        );
        return;
      }
      if (count && count < files.length) {
        showAlert(
          'Error',
          `Only ${count} file${
            count !== 1 ? 's' : ''
          } can be uploaded at a time`,
        );
        return;
      }

      if (files && files.length) {
        const newFiles = files.map((file) => ({
          name: file.name,
          file,
          type: file.type,
          size: file.size,
        }));

        onUpload(newFiles);
        toast({
          title: 'File Selected',
          description: 'File selected successfully',
        });
      }
    },
    [
      setDragging,
      formats,
      ownerLicense.length,
      count,
      showAlert,
      onUpload,
      toast,
    ],
  );

  useEffect(() => {
    function handleDragOver(e: DragEvent) {
      e.preventDefault();
      e.stopPropagation();
      setDragging(true);
    }

    function handleDragLeave(e: DragEvent) {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
    }

    function handleDropEvent(e: DragEvent) {
      handleDrop(e, 'dragEvent');
    }

    const currentDropContainer = dropContainer.current;
    if (currentDropContainer) {
      currentDropContainer.addEventListener('dragover', handleDragOver);
      currentDropContainer.addEventListener('drop', handleDropEvent);
      currentDropContainer.addEventListener('dragleave', handleDragLeave);
    }

    return () => {
      if (currentDropContainer) {
        currentDropContainer.removeEventListener('dragover', handleDragOver);
        currentDropContainer.removeEventListener('drop', handleDropEvent);
        currentDropContainer.removeEventListener('dragleave', handleDragLeave);
      }
    };
  }, [ownerLicense, dropContainer, handleDrop]);

  return (
    <>
      {!ownerLicense.length && (
        <div
          className={`${
            dragging
              ? 'border border-primary dark:bg-slate-800'
              : 'border-dashed border-gray-300 dark:border-slate-800'
          } flex items-center justify-center mx-auto text-center border-2 rounded-md mt-4 p-14`}
          ref={dropContainer}
          onDragOver={(e) => handleDrop(e, 'dragOver')}
          onDrop={(e) => handleDrop(e, 'drop')}
        >
          <div className="flex flex-col flex-1">
            <Upload className="mx-auto mb-2 text-gray-400" />
            <div className="text-xs font-normal text-gray-500">
              <input
                className="hidden opacity-0"
                type="file"
                multiple
                accept=".wasm"
                ref={fileRef}
                onChange={(e) => handleDrop(e, 'inputFile')}
              />
              <div className="flex gap-1">
                <span
                  className="cursor-pointer text-primary "
                  onClick={() => {
                    fileRef.current?.click();
                  }}
                >
                  Click to upload
                </span>
                <span className="text-xs font-normal text-gray-500 select-none">
                  or drag and drop
                </span>
              </div>
            </div>
            <div className="text-xs font-normal text-gray-500 select-none">
              Only WASM files
            </div>
          </div>
        </div>
      )}

      {ownerLicense.length > 0 && (
        <div className="flex justify-center mt-4 align-middle gap-y-4 gap-x-4">
          {ownerLicense.map((file, index) => (
            <div
              key={index}
              className="px-3 w-[50%] gap-4 py-3 rounded-md bg-slate-900 flex justify-between align-middle items-center"
            >
              <div className="flex items-center gap-2">
                <FileText className="text-primary" />
                <div className="flex flex-col text-xs font-medium text-gray-500 select-none">
                  {truncateFileName(file.name, 15)}
                  <div className="text-sm font-medium text-gray-400">{`${Math.floor(
                    file.size / 1024,
                  )} KB`}</div>
                </div>
              </div>
              <X
                className={`text-gray-500 transition-colors duration-300 cursor-pointer hover:text-red-300 active:text-primary`}
                onClick={() => onDelete(index)}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
