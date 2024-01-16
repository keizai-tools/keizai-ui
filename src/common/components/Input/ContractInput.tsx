import { Loader } from 'lucide-react';
import React from 'react';

import EnvironmentDropdownContainer from '../Environments/EnvironmentDropdownContainer';
import SaveContractDialog from './SaveContractDialog';

import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Select, SelectTrigger } from '@/common/components/ui/select';
import useEnvironments from '@/common/hooks/useEnvironments';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/common/components/ui/select';
import useNetwork from '@/common/hooks/useNetwork';
import { NETWORK } from '@/common/types/soroban.enum';

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
	const { showEnvironments, handleSelectEnvironment, handleSearchEnvironment } =
		useEnvironments();
	const { selectNetwork, handleUpdateNetwork } = useNetwork(defaultNetwork);

	const handleUpdateContractId = async () => {
		if (contractId) {
			loadContract(contractId);
		}
	};

	const handleSelect = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
		handleSelectEnvironment(e.currentTarget.id, setContractId);
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
					<EnvironmentDropdownContainer
						handleSelect={handleSelect}
						showEnvironments={showEnvironments}
					>
						<Input
							value={contractId || ''}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								handleSearchEnvironment(e.target.value);
								setContractId(e.target.value);
							}}
							className="border-none focus-visible:ring-0"
							placeholder="Contract address"
							data-test="input-contract-name"
						/>
					</EnvironmentDropdownContainer>
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
