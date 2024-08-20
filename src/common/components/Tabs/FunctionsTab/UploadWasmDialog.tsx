import React from 'react';

import { Button, buttonVariants } from '../../ui/button';
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
import SelectNetworkUploadWasm from './SelectNetWorkUploadWasm';

import {
	useEditContractIdMutation,
	useUploadWasmMutation,
} from '@/common/api/invocations';
import { Invocation } from '@/common/types/invocation';
import OverlayLoading from '@/common/views/OverlayLoading';
import { cn } from '@/lib/utils';

interface UploadWasmDialogProps {
	open: boolean;
	onOpenChange: () => void;
	data: Invocation;
	setContractId: (contractId: string) => void;
}

function UploadWasmDialog({
	open,
	onOpenChange,
	data,
	setContractId,
}: UploadWasmDialogProps) {
	const [files, setFiles] = React.useState<FileData[]>([]);

	const uploadWasmMutation = useUploadWasmMutation();

	const editContractIdMutation = useEditContractIdMutation();

	const { toast } = useToast();

	function uploadFiles(f: FileData[]) {
		setFiles([...files, ...f]);
	}

	function deleteFile(indexFile: number) {
		const updatedList = files.filter((_, index) => index !== indexFile);
		setFiles(updatedList);
	}

	async function handleUploadWasm() {
		if (files.length > 0) {
			const formData = new FormData();
			formData.append('wasm', files[0].file, files[0].name);

			uploadWasmMutation.mutate(
				{ formData, id: data.id },
				{
					onSuccess: (newContractId) => {
						editContractIdMutation.mutate({
							id: data.id,
							contractId: newContractId,
						});
						onOpenChange();
						toast({
							title: 'Wasm file uploaded',
							description:
								'The Wasm file of the contract has been deployed successfully',
						});
						setContractId(newContractId);
					},
					onError: ({ message }) => {
						toast({
							title: 'Failed to upload Wasm file',
							description: message,
							variant: 'destructive',
						});
					},
				},
			);
		}
	}

	React.useEffect(() => {
		if (!open) {
			setFiles([]);
		}
	}, [open]);

	return (
		<>
			{uploadWasmMutation.isPending && <OverlayLoading />}
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent data-test="import-account-modal-container">
					<DialogHeader>
						<DialogTitle data-test="import-account-modal-title">
							Wasm Upload
						</DialogTitle>
						<DialogDescription data-test="import-account-modal-description">
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
					<DialogFooter className="mt-2">
						<div className="flex items-center justify-between w-full">
							<div className="">
								<SelectNetworkUploadWasm defaultNetwork={'FUTURENET'} />
							</div>
							<div>
								{files.length > 0 && (
									<Button
										type="submit"
										size="sm"
										className="px-3 mt-1/2"
										data-test="edit-entity-dialog-btn-submit"
										onClick={handleUploadWasm}
									>
										Upload
									</Button>
								)}
								<Button
									type="submit"
									size="sm"
									className={cn(
										buttonVariants({ variant: 'outline' }),
										'px-3 mt-1/2 text-primary',
									)}
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
		</>
	);
}

export default UploadWasmDialog;
