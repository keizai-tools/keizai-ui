import { Loader } from 'lucide-react';
import React from 'react';

import SaveContractDialog from './SaveContractDialog';

import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/common/components/ui/select';
import useNetwork from '@/common/hooks/useNetwork';

const ContractInput = ({
	defaultValue = '',
	defaultNetwork,
	loading,
	loadContract,
	runInvocation,
}: {
	defaultValue: string;
	defaultNetwork: string;
	loading: boolean;
	loadContract: (id: string) => Promise<void>;
	runInvocation: () => void;
}) => {
	const [contractId, setContractId] = React.useState(defaultValue);
	const [showEditContractDialog, setShowEditContractDialog] =
		React.useState(false);
	const { selectNetwork, handleUpdateNetwork } = useNetwork(defaultNetwork);

	const handleUpdateContractId = async () => {
		if (contractId) {
			loadContract(contractId);
		}
	};

	return (
		<div
			className="flex items-center border p-2 rounded-md"
			data-test="contract-input-container"
		>
			<Select value={selectNetwork} onValueChange={handleUpdateNetwork}>
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
						value="FUTURENET"
						data-test="contract-select-network-futurenet"
					>
						FUTURENET
					</SelectItem>
					<SelectItem
						value="TESTNET"
						data-test="contract-select-network-testnet"
					>
						TESTNET
					</SelectItem>
				</SelectContent>
			</Select>
			<div className="flex w-full group">
				{defaultValue ? (
					<div className="flex items-center justify-between flex-1 w-full relative">
						<span>{defaultValue}</span>
						<Button
							variant="link"
							className="invisible group-hover:visible absolute right-0 bg-background"
							onClick={() => {
								setShowEditContractDialog(true);
							}}
						>
							Edit contract address
						</Button>
					</div>
				) : (
					<Input
						value={contractId || ''}
						onChange={(e) => setContractId(e.target.value)}
						className="border-none focus-visible:ring-0"
						placeholder="Contract address"
						data-test="input-contract-name"
					/>
				)}
				{!defaultValue ? (
					<Button
						data-test="contract-input-btn-load"
						className="transition-all"
						disabled={loading}
						onClick={() => {
							handleUpdateContractId();
						}}
					>
						{!loading ? 'LOAD' : <Loader className="animate-spin" size="14" />}
					</Button>
				) : (
					<Button
						data-test="contract-input-btn-load"
						className="transition-all"
						onClick={runInvocation}
						type="button"
						disabled={loading}
					>
						{!loading ? (
							'RUN'
						) : (
							<div className="flex gap-1 items-center">
								<Loader className="animate-spin" size="14" /> Running
							</div>
						)}
					</Button>
				)}
			</div>
			{showEditContractDialog && (
				<SaveContractDialog
					open={showEditContractDialog}
					onOpenChange={setShowEditContractDialog}
				/>
			)}
		</div>
	);
};

export default ContractInput;
