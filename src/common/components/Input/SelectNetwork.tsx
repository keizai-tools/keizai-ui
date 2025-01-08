import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/ui/select';
import { useEphemeralProvider } from '@/common/context/useEphemeralContext';
import useNetwork from '@/common/hooks/useNetwork';
import { NETWORK } from '@/common/types/soroban.enum';

function SelectNetwork({
  network,
}: Readonly<{
  network: NETWORK;
}>) {
  const { handleUpdateNetwork } = useNetwork(false);
  const { status } = useEphemeralProvider();
  function handleNetworkChange(selectedNetwork: NETWORK) {
    if (selectedNetwork === NETWORK.EPHEMERAL) {
      handleUpdateNetwork(NETWORK.EPHEMERAL);
    } else {
      handleUpdateNetwork(selectedNetwork);
      if (window.umami) window.umami.track('Change network');
    }
  }

  return (
    <Select value={network} onValueChange={handleNetworkChange}>
      <SelectTrigger
        className="w-auto gap-2 px-4 py-3 font-bold border-2 rounded-md shadow-md border-slate-900 text-slate-500 focus:outline-none focus:ring-0 ring-0 focus-visible:ring-0 focus:ring-transparent"
        data-test="contract-input-network"
      >
        <SelectValue
          aria-label={network}
          data-test="contract-input-selected-network"
          className="flex items-center justify-between"
        >
          {network}
        </SelectValue>
      </SelectTrigger>

      <SelectContent
        data-test="contract-select-networks-container"
        className="w-full mt-2 overflow-hidden rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
      >
        <SelectItem
          value={NETWORK.SOROBAN_FUTURENET}
          data-test="contract-select-network-futurenet"
          className="transition-colors duration-200 cursor-pointer text-slate-700"
        >
          {NETWORK.SOROBAN_FUTURENET}
        </SelectItem>
        <SelectItem
          value={NETWORK.SOROBAN_TESTNET}
          data-test="contract-select-network-testnet"
          className="transition-colors duration-200 cursor-pointer text-slate-700"
        >
          {NETWORK.SOROBAN_TESTNET}
        </SelectItem>
        <SelectItem
          value={NETWORK.SOROBAN_MAINNET}
          data-test="contract-select-network-mainnet"
          className="transition-colors duration-200 cursor-pointer text-slate-700"
        >
          {NETWORK.SOROBAN_MAINNET}
        </SelectItem>
        {status.isEphemeral && (
          <SelectItem
            value={NETWORK.EPHEMERAL}
            data-test="contract-select-network-ephemeral"
            className="transition-colors duration-200 cursor-pointer text-slate-700"
          >
            {NETWORK.EPHEMERAL}
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}

export default SelectNetwork;
