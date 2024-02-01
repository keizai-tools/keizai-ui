import { AlertCircleIcon } from 'lucide-react';
import React from 'react';

import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '../ui/alert-dialog';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/common/components/ui/select';
import useNetwork from '@/common/hooks/useNetwork';
import { NETWORK } from '@/common/types/soroban.enum';

function SelectNetwork({ defaultNetwork }: { defaultNetwork: string }) {
	const [showEditNetworkDialog, setShowEditNetworkDialog] =
		React.useState(false);
	const { selectNetwork, setSelectNetwork, handleUpdateNetwork } =
		useNetwork(defaultNetwork);

	const openEditNetworkDialog = (network: string) => {
		setSelectNetwork(network);
		setShowEditNetworkDialog(true);
	};

	const onConfirm = () => {
		handleUpdateNetwork(selectNetwork);
		setShowEditNetworkDialog(false);
	};

	const onCancel = () => {
		setSelectNetwork(defaultNetwork);
		setShowEditNetworkDialog(false);
	};

	return (
		<>
			<Select value={selectNetwork} onValueChange={openEditNetworkDialog}>
				<SelectTrigger
					className="max-w-[140px] border-none text-slate-500 font-semibold"
					data-test="contract-input-network"
				>
					<SelectValue
						aria-label={selectNetwork}
						data-test="contract-input-selected-network"
					>
						{selectNetwork}
					</SelectValue>
				</SelectTrigger>
				<SelectContent data-test="contract-select-networks-container">
					<SelectItem
						value={NETWORK.SOROBAN_FUTURENET}
						data-test="contract-select-network-futurenet"
					>
						{NETWORK.SOROBAN_FUTURENET}
					</SelectItem>
					<SelectItem
						value={NETWORK.SOROBAN_TESTNET}
						data-test="contract-select-network-testnet"
					>
						{NETWORK.SOROBAN_TESTNET}
					</SelectItem>
				</SelectContent>
			</Select>
			{showEditNetworkDialog && (
				<AlertDialog
					open={showEditNetworkDialog}
					onOpenChange={setShowEditNetworkDialog}
				>
					<AlertDialogContent data-test="change-network-dialog-container">
						<AlertDialogHeader>
							<AlertDialogTitle data-test="change-network-dialog-header-title">
								Update Network
							</AlertDialogTitle>
							<div>
								<Alert variant="destructive" className="my-5">
									<AlertCircleIcon className="h-4 w-4" />
									<AlertTitle data-test="change-network-dialog-title">
										Warning!
									</AlertTitle>
									<AlertDescription data-test="change-network-dialog-description">
										This will remove your current loaded contract, keys,
										functions and parameters.
									</AlertDescription>
								</Alert>
							</div>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel
								onClick={onCancel}
								data-test="change-network-dialog-btn-cancel"
							>
								Cancel
							</AlertDialogCancel>
							<AlertDialogAction
								onClick={onConfirm}
								data-test="change-network-dialog-btn-continue"
							>
								Change
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
		</>
	);
}

export default SelectNetwork;
