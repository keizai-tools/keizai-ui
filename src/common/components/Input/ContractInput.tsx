import { Loader } from 'lucide-react';
import React from 'react';

import EnvironmentDropdownContainer from '../Environments/EnvironmentDropdownContainer';
import EnvironmentInput from './EnvironmentInput';
import SaveContractDialog from './SaveContractDialog';

import { Button } from '@/common/components/ui/button';
import useEnvironments from '@/common/hooks/useEnvironments';
import { Method } from '@/common/types/method';

function ContractInput({
	defaultValue = '',
	defaultNetwork,
	loading,
	loadContract,
	runInvocation,
	method,
	hideRunButton = false,
}: Readonly<{
	defaultValue: string;
	defaultNetwork: string;
	loading: boolean;
	loadContract: (contractId: string) => void;
	runInvocation: () => void;
	method?: Method;
	hideRunButton?: boolean;
}>) {
	const [contractId, setContractId] = React.useState(defaultValue);

	const [showEditContractDialog, setShowEditContractDialog] =
		React.useState(false);
	const {
		showEnvironments,
		handleSelectEnvironment,
		handleSearchEnvironment,
		setShowEnvironments,
	} = useEnvironments();

	async function handleUpdateContractId() {
		if (contractId) {
			loadContract(contractId);
			if (window.umami) window?.umami?.track('Load contract');
		}
	}

	function handleSelect(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
		const environmentValue = handleSelectEnvironment(e.currentTarget.id);
		setContractId(`{{${environmentValue}}}`);
	}

	function handleChange(value: string) {
		handleSearchEnvironment(value);
		setContractId(value);
	}

	return (
		<div
			className="flex items-center gap-4 p-2 border rounded-md"
			data-test="contract-input-container"
		>
			{defaultNetwork !== 'AUTO_DETECT' && (
				<div
					className="flex flex-col items-start gap-1 mr-2"
					data-test="contract-input-network-container"
				>
					<p className="text-sm text-gray-400 select-none">Network:</p>
					<p
						className="text-sm font-bold text-gray-400 select-none text-primary"
						data-test="contract-input-network"
					>
						{defaultNetwork}
					</p>
				</div>
			)}
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
								if (window.umami)
									window?.umami?.track('Open edit contract address dialog');
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
						className="w-auto px-8 py-3 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
						disabled={loading || !contractId}
						onClick={() => {
							handleUpdateContractId();
						}}
					>
						{!loading ? (
							'LOAD'
						) : (
							<Loader className="w-auto font-bold animate-spin" size="20" />
						)}
					</Button>
				) : (
					!hideRunButton && (
						<Button
							data-test="contract-input-btn-load"
							className="w-auto px-4 py-3 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
							onClick={runInvocation}
							type="button"
							disabled={loading || !method}
						>
							{!loading ? (
								'RUN'
							) : (
								<div className="flex items-center gap-2">
									<Loader className="w-auto font-bold animate-spin" size="20" />
									<p>Running</p>
								</div>
							)}
						</Button>
					)
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
}

export default ContractInput;
