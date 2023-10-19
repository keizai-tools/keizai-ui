import { ListPlusIcon } from 'lucide-react';
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

const CollectionPlaceholder = () => {
	const { control, handleSubmit } = useForm({
		defaultValues: {
			name: 'Collection',
		},
	});
	const { mutate } = useNewCollectionMutation();

	const onSubmit = async ({ name }: { name: string }) => {
		await mutate({ name });
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					className="flex flex-col gap-4 border-dashed border-2 border-primary rounded-lg h-[200px] w-[300px] font-bold"
					data-test="collections-header-btn-new"
				>
					<ListPlusIcon size={42} />
					Create a new collection
				</Button>
			</DialogTrigger>
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
					<Button type="submit" size="sm" className="px-3">
						Create
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default CollectionPlaceholder;
