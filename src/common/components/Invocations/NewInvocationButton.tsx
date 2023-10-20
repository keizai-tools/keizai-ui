import { PlusIcon } from 'lucide-react';

import NewEntityDialog from '../Entity/NewEntityDialog';
import { Button } from '../ui/button';

import { useCreateInvocationMutation } from '@/common/api/invocations';

const NewInvocationButton = ({ folderId }: { folderId: string }) => {
	const { mutate, isPending } = useCreateInvocationMutation();

	return (
		<NewEntityDialog
			defaultName="Invocation"
			title="New invocation"
			description="Let's name your invocation"
			isLoading={isPending}
			onSubmit={async ({ name }) => {
				await mutate({ name, folderId });
			}}
		>
			<Button
				variant="link"
				className="flex gap-2 text-xs text-slate-500 hover:text-slate-100 p-0"
			>
				<PlusIcon size={12} /> Add invocation
			</Button>
		</NewEntityDialog>
	);
};

export default NewInvocationButton;
