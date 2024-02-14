import { AlertCircleIcon } from 'lucide-react';
import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import EnvironmentDropdownContainer from '../Environments/EnvironmentDropdownContainer';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useToast } from '../ui/use-toast';
import EnvironmentInput from './EnvironmentInput';

import { useEditInvocationMutation } from '@/common/api/invocations';
import useContractEvents from '@/common/hooks/useContractEvents';
import useEnvironments from '@/common/hooks/useEnvironments';

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
	const { removeEventsFromStorage } = useContractEvents();
	const { showEnvironments, handleSelectEnvironment, handleSearchEnvironment } =
		useEnvironments();
	const { control, handleSubmit, setValue } = useForm({
		defaultValues: {
			contractId: '',
		},
	});

	const handleSelect = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
		const environmentValue = handleSelectEnvironment(e.currentTarget.id);
		setValue('contractId', `{{${environmentValue}}}`);
	};

	const handleChange = (value: string) => {
		handleSearchEnvironment(value);
		setValue('contractId', value);
	};

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
			await mutate(
				{
					id: invocationId,
					contractId: data.contractId,
				},
				{
					onSuccess: () => {
						removeEventsFromStorage(invocationId);
					},
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
			<DialogContent data-test="dialog-edit-contract-address-container">
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
					<EnvironmentDropdownContainer
						handleSelect={handleSelect}
						showEnvironments={showEnvironments}
					>
						<EnvironmentInput
							value={contractId}
							handleChange={handleChange}
							styles="h-10 rounded-md border border-input text-sm"
							placeholder="C . . . "
							testName="dialog-edit-contract-address-input"
						/>
					</EnvironmentDropdownContainer>
					<Alert variant="destructive" className="my-5">
						<AlertCircleIcon className="h-4 w-4" />
						<AlertTitle>Warning!</AlertTitle>
						<AlertDescription>
							This will remove your current functions and parameters.
						</AlertDescription>
					</Alert>
					<Button
						disabled={!contractId.trim() || isPending}
						data-test="dialog-edit-contract-address-btn-save"
					>
						{isPending ? 'Saving...' : 'Save'}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default SaveContractDialog;
