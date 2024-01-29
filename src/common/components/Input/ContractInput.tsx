import { Loader } from 'lucide-react';
import React from 'react';

import EnvironmentInputContainer from '../Environments/EnvironmentDropdownContainer';
import SaveContractDialog from './SaveContractDialog';
import SelectNetwork from './SelectNetwork';

import { Button } from '@/common/components/ui/button';
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
		const environmentValue = handleSelectEnvironment(e.currentTarget.id);
		setContractId(`{{${environmentValue}}}`);
	};

	const handleChange = (value: string | undefined) => {
		handleSearchEnvironment(value ?? '');
		setContractId(value ?? '');
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
						<span
							className={defaultValue.match(/{{(.*?)}}/) ? 'text-primary' : ''}
							data-test="contract-input-address"
						>
							{defaultValue}
						</span>
						<Button
							variant="link"
							className="invisible group-hover:visible absolute right-0 bg-background"
							data-test="btn-edit-contract-address"
							onClick={() => {
								setShowEditContractDialog(true);
							}}
						>
							Edit contract address
						</Button>
					</div>
				) : (
					<EnvironmentInputContainer
						value={contractId || ''}
						handleChange={handleChange}
						handleSelectEnvironment={handleSelect}
						showEnvironments={showEnvironments}
						styles="h-full"
						placeholder="Contract address"
						background={'#020817'}
						fontSize={16}
						testName="input-contract-name"
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
