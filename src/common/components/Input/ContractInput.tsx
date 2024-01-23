import { Loader } from 'lucide-react';
import React from 'react';

import EnvironmentDropdownContainer from '../Environments/EnvironmentDropdownContainer';
import SaveContractDialog from './SaveContractDialog';
import SelectNetwork from './SelectNetwork';

import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import useEnvironments from '@/common/hooks/useEnvironments';

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
			<SelectNetwork defaultNetwork={defaultNetwork} />
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
