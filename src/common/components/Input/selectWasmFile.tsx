import { useState } from 'react';

import { Button } from '../ui/button';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/common/components/ui/select';

function SelectWasmFile({
  wasmFiles,
  selectedFile,
  onFileChange,
}: Readonly<{
  wasmFiles: { id: string; url: string }[];
  selectedFile: string;
  onFileChange: (file: string) => void;
}>) {
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);

  const handleSelectChange = (fileId: string) => {
    const selected = wasmFiles.find((file) => file.id === fileId);
    if (selected) {
      setSelectedFileUrl(selected.url);
    }
    onFileChange(fileId);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <Select value={selectedFile} onValueChange={handleSelectChange}>
          <SelectTrigger className="w-auto gap-2 px-4 py-3 font-bold border-2 rounded-md shadow-md border-slate-900 text-slate-500 focus:outline-none focus:ring-0">
            <span
              className={selectedFile ? 'text-slate-700' : 'text-slate-400'}
            >
              {selectedFile || 'Select a Wasm file'}
            </span>
          </SelectTrigger>
          <SelectContent className="w-full mt-2 overflow-hidden rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
            {wasmFiles.length > 0 ? (
              wasmFiles.map(({ id }) => (
                <SelectItem
                  key={id}
                  value={id}
                  className="transition-colors duration-200 cursor-pointer text-slate-700"
                >
                  {id}
                </SelectItem>
              ))
            ) : (
              <SelectItem
                value=""
                disabled
                className="text-gray-400 cursor-not-allowed"
              >
                No files available
              </SelectItem>
            )}
          </SelectContent>
        </Select>

        {selectedFileUrl && (
          <a href={selectedFileUrl} target="_blank" rel="noopener noreferrer">
            <Button
              className="px-4 py-2 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105"
              variant="outline"
            >
              Download
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}

export default SelectWasmFile;
