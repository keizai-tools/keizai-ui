import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Select, SelectTrigger } from '@/common/components/ui/select';

const ContractInput = () => {
	return (
		<div
			className="flex items-center border p-2 rounded-md"
			data-test="contract-input-container"
		>
			<Select disabled>
				<SelectTrigger
					className="max-w-[200px] border-none"
					data-test="contract-input-network"
				>
					FUTURENET
				</SelectTrigger>
			</Select>
			<Input
				className="border-none focus-visible:ring-0"
				defaultValue="f47e3e34187dc84aa9ff41108082d289cdf6e40720cdfba8fcd9974369b9d32e"
				placeholder="Contract adress"
				data-test="input-contract-name"
			/>
			<Tooltip delayDuration={0}>
				<TooltipTrigger asChild>
					<Button
						className="bg-primary dark:bg-primary text-black"
						data-test="contract-input-btn-load"
					>
						LOAD
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p data-test="contract-input-btn-load-tooltip">Coming soon</p>
				</TooltipContent>
			</Tooltip>
		</div>
	);
};

export default ContractInput;
