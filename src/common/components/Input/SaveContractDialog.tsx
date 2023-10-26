import { AlertCircleIcon } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';

import { useEditInvocationMutation } from '@/common/api/invocations';

const SaveContractDialog = ({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) => {
	const { toast } = useToast();
	const { invocationId } = useParams();
	const { mutate, isPending } = useEditInvocationMutation();
	const { control, register, handleSubmit } = useForm({
		defaultValues: {
			contractId: '',
		},
	});
	const contractId = useWatch({
		control,
		name: 'contractId',
	});

	const onSubmit = async (data: { contractId: string }) => {
		if (!invocationId) {
			toast({
				title: 'Oops!',
				description: 'There was an problem saving the contract address',
			});
			return;
		}

		try {
			console.log('submit', invocationId);
			await mutate(
				{
					id: invocationId,
					contractId: data.contractId,
				},
				{
					onError: () => {
						toast({
							title: "Couldn't save contract",
							description: 'Please check the contract address',
							variant: 'destructive',
						});
					},
				},
			);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Update contract address</DialogTitle>
				</DialogHeader>
				<form
					className="flex flex-col w-full"
					onSubmit={handleSubmit(onSubmit)}
				>
					<span className="text-sm text-slate-500 mb-1">
						New contract address
					</span>
					<Input
						placeholder="C . . . "
						{...register('contractId', {
							required: 'Contract address is required',
						})}
					/>
					<Alert variant="destructive" className="my-5">
						<AlertCircleIcon className="h-4 w-4" />
						<AlertTitle>Warning!</AlertTitle>
						<AlertDescription>
							This will remove your current parameters.
						</AlertDescription>
					</Alert>
					<Button disabled={!contractId.trim() || isPending}>
						{isPending ? 'Saving...' : 'Save'}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default SaveContractDialog;
