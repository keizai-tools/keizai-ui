import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/common/components/ui/select';
import useNetwork from '@/common/hooks/useNetwork';
import { NETWORK } from '@/common/types/soroban.enum';

interface SelectNetworkUploadWasmProps {
	defaultNetwork: string;
}

function SelectNetworkUploadWasm({
	defaultNetwork,
}: Readonly<SelectNetworkUploadWasmProps>) {
	const { selectNetwork, handleUpdateNetwork } = useNetwork(defaultNetwork);

	function onConfirm(network: string) {
		handleUpdateNetwork(network);
		window.umami.track('Change network', { network: selectNetwork });
	}

	return (
		<Select value={selectNetwork} onValueChange={onConfirm}>
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
				<SelectItem
					value={NETWORK.SOROBAN_MAINNET}
					data-test="contract-select-network-mainnet"
				>
					{NETWORK.SOROBAN_MAINNET}
				</SelectItem>
			</SelectContent>
		</Select>
	);
}

export default SelectNetworkUploadWasm;
