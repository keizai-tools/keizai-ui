import { AlertCircleIcon } from 'lucide-react';
import React, { Fragment } from 'react';

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

function SelectNetwork({
	defaultNetwork,
}: Readonly<{ defaultNetwork: string }>) {
	const [showEditNetworkDialog, setShowEditNetworkDialog] =
		React.useState(false);
	const { selectNetwork, setSelectNetwork, handleUpdateNetwork } =
		useNetwork(defaultNetwork);

	function openEditNetworkDialog(network: string) {
		setSelectNetwork(network);
		if (window.umami) window?.umami?.track('Open change network dialog');
		setShowEditNetworkDialog(true);
	}

	function onConfirm() {
		handleUpdateNetwork(selectNetwork);
		if (window.umami)
			window?.umami?.track('Change network', { network: selectNetwork });
		setShowEditNetworkDialog(false);
	}

	function onCancel() {
		setSelectNetwork(defaultNetwork);
		setShowEditNetworkDialog(false);
	}

	if (selectNetwork === 'AUTO_DETECT') return null;

	return (
		<Fragment>
			<Select
				value={selectNetwork}
				onValueChange={openEditNetworkDialog}
				disabled
			>
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
						value={'AUTO_DETECT'}
						data-test="contract-select-network-auto-detect"
					>
						{'AUTO_DETECT'}
					</SelectItem>
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
					<SelectItem
						value={NETWORK.SOROBAN_MAINNET}
						data-test="contract-select-network-mainnet"
					>
						{NETWORK.SOROBAN_MAINNET}
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
									<AlertCircleIcon className="w-4 h-4" />
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
		</Fragment>
	);
}

export default SelectNetwork;
