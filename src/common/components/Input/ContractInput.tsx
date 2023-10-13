import React from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Select, SelectTrigger } from '@/common/components/ui/select';

const ContractInput = ({
	loadContract,
}: {
	loadContract: (id: string) => void;
}) => {
	const [contractId, setContractId] = React.useState('');

	return (
		<div
			className="flex items-center border p-2 rounded-md"
			data-test="contract-input-container"
		>
			<Tooltip delayDuration={0}>
				<Select disabled>
					<TooltipTrigger asChild>
						<SelectTrigger
							className="max-w-[200px] border-none"
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

			<Input
				value={contractId}
				onChange={(e) => setContractId(e.target.value)}
				className="border-none focus-visible:ring-0"
				placeholder="Contract address"
				data-test="input-contract-name"
			/>
			<Button
				disabled={!contractId}
				onClick={() => {
					if (contractId) {
						loadContract(contractId);
					}
				}}
				data-test="contract-input-btn-load"
				className="transition-all"
			>
				LOAD
			</Button>
		</div>
	);
};

export default ContractInput;
