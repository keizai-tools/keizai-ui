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
}: CustomDragDropProps) {
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
					file, // Store the actual File object
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
			<div
				className={`${
					dragging
						? 'border border-primary dark:bg-slate-800'
						: 'border-dashed border-[#e0e0e0]'
				} flex items-center justify-center mx-auto text-center border-2 rounded-md mt-4 p-14`}
				ref={dropContainer}
				onDragOver={(e) => handleDrop(e, 'dragOver')}
				onDrop={(e) => handleDrop(e, 'drop')}
			>
				<div className="flex-1 flex flex-col">
					<div className="mx-auto text-gray-400 mb-2">
						<Upload size={18} />
					</div>
					<div className="text-[12px] font-normal text-gray-500">
						<input
							className="opacity-0 hidden"
							type="file"
							multiple
							accept=".wasm"
							ref={fileRef}
							onChange={(e) => handleDrop(e, 'inputFile')}
						/>
						<span
							className="text-[#4070f4] cursor-pointer"
							onClick={() => {
								fileRef.current?.click();
							}}
						>
							Click to upload
						</span>{' '}
						or drag and drop
					</div>
					<div className="text-[10px] font-normal text-gray-500">
						Only WASM files
					</div>
				</div>
			</div>

			{ownerLicense.length > 0 && (
				<div className="mt-4 grid grid-cols-2 gap-y-4 gap-x-4">
					{ownerLicense.map((file, index) => (
						<div
							key={index}
							className="w-full px-3 py-3.5 rounded-md bg-slate-200 space-y-3"
						>
							<div className="flex justify-between">
								<div className="w-[70%] flex justify-start items-center space-x-2">
									<div className="text-[#5E62FF] text-[37px] cursor-pointer">
										{file.type.match(/image.*/i) ? <FileText /> : <FileText />}
									</div>
									<div className=" space-y-1">
										<div className="text-xs font-medium text-gray-500">
											{truncateFileName(file.name, 15)}
										</div>
										<div className="text-[10px] font-medium text-gray-400">{`${Math.floor(
											file.size / 1024,
										)} KB`}</div>
									</div>
								</div>
								<div className="flex-1 flex justify-end">
									<div className="space-y-1">
										<div
											className="text-gray-500 text-[17px] cursor-pointer"
											onClick={() => onDelete(index)}
										>
											<X className="ml-auto" />
										</div>
										<div className="text-[10px] font-medium text-gray-400">
											Done
										</div>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</>
	);
}
