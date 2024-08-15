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
	const {
		showEnvironments,
		handleSelectEnvironment,
		handleSearchEnvironment,
		setShowEnvironments,
	} = useEnvironments();
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
			mutate(
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
			window.umami.track('Edit contract address');
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				data-test="dialog-edit-contract-address-container"
				className="max-w-[600px]"
			>
				<DialogHeader>
					<DialogTitle>Update contract address</DialogTitle>
				</DialogHeader>
				<form
					className="flex flex-col w-full"
					onSubmit={handleSubmit(onSubmit)}
				>
					<span className="mb-1 text-sm text-slate-500">
						New contract address
					</span>
					<EnvironmentDropdownContainer
						handleSelect={handleSelect}
						showEnvironments={showEnvironments}
						setShowEnvironments={setShowEnvironments}
					>
						<EnvironmentInput
							value={contractId}
							handleChange={handleChange}
							styles="h-10 rounded-md border border-input text-sm max-w-[550px]"
							placeholder="C . . . "
							testName="dialog-edit-contract-address-input"
						/>
					</EnvironmentDropdownContainer>
					<Alert variant="destructive" className="my-5">
						<AlertCircleIcon className="w-4 h-4" />
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
