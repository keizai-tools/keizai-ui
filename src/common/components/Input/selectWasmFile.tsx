import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/ui/select';

function SelectWasmFile({
  wasmFiles,
  selectedFile,
  onFileChange,
}: Readonly<{
  wasmFiles: { id: string }[];
  selectedFile: string;
  onFileChange: (file: string) => void;
}>) {
  const handleSelectChange = (fileId: string) => {
    onFileChange(fileId);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <Select value={selectedFile} onValueChange={handleSelectChange}>
          <SelectTrigger className="w-auto gap-2 px-4 py-3 font-bold border-2 rounded-md shadow-md border-slate-900 text-slate-400 focus:outline-none focus:ring-0 ring-0 focus-visible:ring-0 focus:ring-transparent">
            <SelectValue
              aria-label={selectedFile || 'Select a Wasm file'}
              data-test="contract-input-selected-network"
              className="flex items-center justify-between"
            >
              {selectedFile || 'Select a Wasm file'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="w-full mt-2 overflow-hidden rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
            {wasmFiles.length > 0 ? (
              <>
                <SelectItem
                  value="Select a Wasm file"
                  className="transition-colors duration-200 cursor-pointer text-slate-700"
                >
                  Select a Wasm file
                </SelectItem>
                {wasmFiles.map(({ id }) => (
                  <SelectItem
                    key={id}
                    value={id}
                    className="transition-colors duration-200 cursor-pointer text-slate-700"
                  >
                    {id.trim()}
                  </SelectItem>
                ))}
              </>
            ) : (
              <SelectItem
                value=""
                disabled
                className="transition-colors duration-200 cursor-pointer text-slate-700"
              >
                No files available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default SelectWasmFile;
