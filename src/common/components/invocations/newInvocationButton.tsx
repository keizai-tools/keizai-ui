import { PlusIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import NewEntityDialog from '../entity/newEntityDialog';
import { Button } from '../ui/button';

import { useCreateInvocationMutation } from '@/common/api/invocations';

function NewInvocationButton({ folderId }: Readonly<{ folderId: string }>) {
	const { mutate, isPending } = useCreateInvocationMutation();
	const navigate = useNavigate();

	return (
		<NewEntityDialog
			defaultName="Invocation"
			title="New invocation"
			description="Let's name your invocation"
			isLoading={isPending}
			onSubmit={({ name }) => {
				mutate(
					{ name, folderId },
					{
						onSuccess: (invocation) => {
							navigate(`invocation/${invocation.id}`);
						},
					},
				);
				if (window.umami) window?.umami?.track('Create invocation');
			}}
		>
			<Button
				variant="link"
				className="flex gap-2 p-0 text-xs text-slate-500 hover:text-slate-100"
				data-test="new-invocation-btn-container"
			>
				<PlusIcon size={12} /> Add invocation
			</Button>
		</NewEntityDialog>
	);
}

export default NewInvocationButton;
