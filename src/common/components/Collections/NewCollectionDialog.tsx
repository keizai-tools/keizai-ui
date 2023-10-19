import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '../ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';

import { useNewCollectionMutation } from '@/common/api/collections';

const NewCollectionDialog = ({ children }: { children: React.ReactNode }) => {
	const { control, handleSubmit } = useForm({
		defaultValues: {
			name: 'Collection',
		},
	});
	const { mutate, isPending } = useNewCollectionMutation();

	const onSubmit = async ({ name }: { name: string }) => {
		await mutate({ name });
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>New collection</DialogTitle>
					<DialogDescription>Let's name your collection</DialogDescription>
				</DialogHeader>
				<form
					className="flex items-center space-x-2 mt-4"
					onSubmit={handleSubmit(onSubmit)}
				>
					<div className="grid flex-1 gap-2">
						<Controller
							control={control}
							name="name"
							rules={{ required: true }}
							render={({ field }) => (
								<Input defaultValue="Collection" {...field} />
							)}
						/>
					</div>
					<Button type="submit" size="sm" className="px-3" disabled={isPending}>
						{isPending ? 'Creating...' : 'Create'}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default NewCollectionDialog;
