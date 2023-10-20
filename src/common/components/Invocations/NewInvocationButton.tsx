import { PlusIcon } from 'lucide-react';

import NewEntityDialog from '../Entity/NewEntityDialog';
import { Button } from '../ui/button';

const NewInvocationButton = () => {
	return (
		<NewEntityDialog
			defaultName="Invocation"
			title="New invocation"
			description="Let's name your invocation"
			isLoading={false}
			onSubmit={async () => {
				// TODO Implement new invocation
			}}
		>
			<Button variant="link" className="flex gap-2 text-xs text-slate-400 p-0">
				<PlusIcon size={12} /> Add invocation
			</Button>
		</NewEntityDialog>
	);
};

export default NewInvocationButton;
