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
		await onSubmit({ name });
		reset();
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent data-test="new-entity-dialog-container">
				<DialogHeader>
					<DialogTitle data-test="new-entity-dialog-title">{title}</DialogTitle>
					<DialogDescription data-test="new-entity-dialog-description">
						{description}
					</DialogDescription>
				</DialogHeader>
				<form
					className="flex items-center space-x-2 mt-4"
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
							className="px-3"
							disabled={isLoading}
							data-test="new-entity-dialog-btn-submit"
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
