import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '../ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';

const NewEntityDialog = ({
	children,
	onSubmit,
	isLoading,
	title,
	description,
	defaultName,
}: {
	children: React.ReactNode;
	onSubmit: ({ name }: { name: string }) => void;
	isLoading: boolean;
	title: string;
	description: string;
	defaultName: string;
}) => {
	const { control, handleSubmit, reset } = useForm({
		defaultValues: {
			name: defaultName,
		},
	});

	const submitAndReset = async ({ name }: { name: string }) => {
		onSubmit({ name });
		reset();
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent
				className="flex flex-col w-auto h-auto gap-4 p-6 font-bold border-2 border-solid rounded-lg shadow-lg border-offset-background max-w-prose"
				data-test="new-entity-dialog-container"
			>
				<DialogHeader>
					<DialogTitle data-test="new-entity-dialog-title">{title}</DialogTitle>
					<DialogDescription data-test="new-entity-dialog-description">
						{description}
					</DialogDescription>
				</DialogHeader>
				<form
					className="flex items-center gap-3 mt-4 space-x-2"
					data-test="new-entity-dialog-form-container"
					onSubmit={handleSubmit(submitAndReset)}
				>
					<div className="grid flex-1 gap-2">
						<Controller
							control={control}
							name="name"
							rules={{ required: true }}
							render={({ field }) => <Input {...field} />}
						/>
					</div>
					<DialogClose asChild>
						<Button
							type="submit"
							size="sm"
							className="w-auto px-8 py-3 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
							data-test="new-entity-dialog-btn-submit"
							disabled={isLoading}
						>
							{isLoading ? 'Creating...' : 'Create'}
						</Button>
					</DialogClose>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default NewEntityDialog;
