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

const EditEntityDialog = ({
	open,
	onOpenChange,
	defaultName,
	title,
	description,
	onEdit,
	isLoading,
}: {
	open: boolean;
	onOpenChange: () => void;
	id: string;
	defaultName: string;
	title: string;
	description: string;
	onEdit: ({ name }: { name: string }) => void;
	isLoading: boolean;
}) => {
	const { control, handleSubmit } = useForm({
		defaultValues: {
			name: defaultName,
		},
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<form
					className="flex items-start space-x-2 mt-4"
					onSubmit={handleSubmit(onEdit)}
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
						disabled={isLoading}
					>
						{isLoading ? 'Saving...' : 'Save'}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default EditEntityDialog;
