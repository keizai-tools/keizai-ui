import { Loader } from 'lucide-react';
import React from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import SaveContractDialog from './SaveContractDialog';

import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Select, SelectTrigger } from '@/common/components/ui/select';

const ContractInput = ({
	defaultValue = '',
	loading,
	loadContract,
	runInvocation,
}: {
	defaultValue: string;
	loading: boolean;
	loadContract: (id: string) => Promise<void>;
	runInvocation: () => void;
}) => {
	const [contractId, setContractId] = React.useState(defaultValue);
	const [showEditContractDialog, setShowEditContractDialog] =
		React.useState(false);

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
			<Tooltip delayDuration={0}>
				<Select disabled>
					<TooltipTrigger asChild>
						<SelectTrigger
							className="max-w-[140px] border-none"
							data-test="contract-input-network"
						>
							FUTURENET
						</SelectTrigger>
					</TooltipTrigger>
				</Select>
				<TooltipContent>
					<p data-test="contract-input-btn-load-tooltip">
						More networks coming soon
					</p>
				</TooltipContent>
			</Tooltip>
			<div className="flex w-full group">
				{defaultValue ? (
					<div className="flex items-center justify-between flex-1">
						<span>{defaultValue}</span>
						<Button
							variant="link"
							className="invisible group-hover:visible"
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
						onClick={() => {
							handleUpdateContractId();
						}}
					>
						{!loading ? 'SAVE' : <Loader className="animate-spin" size="14" />}
					</Button>
				) : (
					<Button
						data-test="contract-input-btn-load"
						className="transition-all"
						onClick={runInvocation}
						type="button"
					>
						{!loading ? 'RUN' : <Loader className="animate-spin" size="14" />}
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
