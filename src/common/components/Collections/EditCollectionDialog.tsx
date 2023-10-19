import { Controller, useForm } from 'react-hook-form';

import { Button } from '../ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';

import { useUpdateCollectionMutation } from '@/common/api/collections';

const EditCollectionDialog = ({
	open,
	onOpenChange,
	id,
	name,
}: {
	open: boolean;
	onOpenChange: () => void;
	id: string;
	name: string;
}) => {
	const { control, handleSubmit } = useForm({
		defaultValues: {
			name,
		},
	});
	const { mutate, isPending } = useUpdateCollectionMutation();

	const onSubmit = async ({ name }: { name: string }) => {
		await mutate({ id, name });
		onOpenChange();
	};
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>New collection</DialogTitle>
					<DialogDescription>Let's name your collection</DialogDescription>
				</DialogHeader>
				<form
					className="flex items-start space-x-2 mt-4 "
					onSubmit={handleSubmit(onSubmit)}
				>
					<div className="grid flex-1 gap-2">
						<Controller
							control={control}
							name="name"
							rules={{ required: 'Name is required', minLength: 1 }}
							render={({ field, fieldState: { error } }) => (
								<div className="flex flex-col gap-1">
									<Input {...field} />
									{error && <p className="text-red-500">{error.message}</p>}
								</div>
							)}
						/>
					</div>
					<Button
						type="submit"
						size="sm"
						className="px-3 mt-1/2"
						disabled={isPending}
					>
						{isPending ? 'Saving...' : 'Save'}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default EditCollectionDialog;
