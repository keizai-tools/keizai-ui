import { Loader } from 'lucide-react';
import React from 'react';

import EnvironmentDropdownContainer from '../Environments/EnvironmentDropdownContainer';
import EnvironmentInput from './EnvironmentInput';
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
	prepareInvocation,
	signedXDR,
	walletPublicKey,
}: {
	defaultValue: string;
	defaultNetwork: string;
	loading: boolean;
	loadContract: (id: string) => Promise<void>;
	runInvocation: () => void;
	prepareInvocation: () => Promise<void>;
	signedXDR: string;
	walletPublicKey: string;
}) => {
	const [contractId, setContractId] = React.useState(defaultValue);
	const [showEditContractDialog, setShowEditContractDialog] =
		React.useState(false);
	const {
		showEnvironments,
		handleSelectEnvironment,
		handleSearchEnvironment,
		setShowEnvironments,
	} = useEnvironments();

	const handleUpdateContractId = async () => {
		if (contractId) {
			loadContract(contractId);
			window.umami.track('Load contract');
		}
	};

	const handleSelect = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
		const environmentValue = handleSelectEnvironment(e.currentTarget.id);
		setContractId(`{{${environmentValue}}}`);
	};

	const handleChange = (value: string) => {
		handleSearchEnvironment(value);
		setContractId(value);
	};

	const showRunButton = !walletPublicKey || (walletPublicKey && signedXDR);

	return (
		<div
			className="flex items-center p-2 border rounded-md"
			data-test="contract-input-container"
		>
			<SelectNetwork defaultNetwork={defaultNetwork} />
			<div className="flex w-full group">
				{defaultValue ? (
					<div className="relative flex items-center justify-between flex-1 w-full">
						<span
							className={
								RegExp(/{{(.*?)}}/).exec(defaultValue) ? 'text-primary' : ''
							}
							data-test="contract-input-address"
						>
							{defaultValue}
						</span>
						<Button
							variant="link"
							className="absolute right-0 invisible group-hover:visible bg-background"
							data-test="btn-edit-contract-address"
							onClick={() => {
								setShowEditContractDialog(true);
								window.umami.track('Open edit contract address dialog');
							}}
						>
							Edit contract address
						</Button>
					</div>
				) : (
					<EnvironmentDropdownContainer
						handleSelect={handleSelect}
						showEnvironments={showEnvironments}
						setShowEnvironments={setShowEnvironments}
					>
						<EnvironmentInput
							value={contractId}
							handleChange={handleChange}
							styles="h-full"
							placeholder="Contract address"
							testName="input-contract-name"
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
				) : showRunButton ? (
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
							<div className="flex items-center gap-1">
								<Loader className="animate-spin" size="14" /> Running
							</div>
						)}
					</Button>
				) : (
					<Button
						data-test="contract-input-btn-load"
						className="transition-all"
						onClick={prepareInvocation}
						type="button"
						disabled={loading}
					>
						{!loading ? (
							'PREPARE'
						) : (
							<div className="flex items-center gap-1">
								<Loader className="animate-spin" size="14" /> Preparing
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
