import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import NetworkStatus from './networkStatus';

import { useStatusNetworkQuery } from '@/common/api/statusNetwork';
import { NETWORK } from '@/common/types/soroban.enum';

export default function StatusNetworkDialog({
  open,
  onOpenChange,
}: Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>) {
  const { data, isLoading } = useStatusNetworkQuery();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-test="dialog-edit-contract-address-container"
        className="flex flex-col w-auto h-auto gap-4 p-6 font-bold border-2 border-solid rounded-lg shadow-lg border-offset-background max-w-prose"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold select-none">
            Network Status
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-400">
          This section shows whether the networks are operational or not.
        </p>

        <div
          className="flex flex-col items-start justify-between w-auto h-full gap-4"
          data-test="collection-folder-container"
        >
          <NetworkStatus
            name={NETWORK.SOROBAN_MAINNET}
            isOperational={!!data?.mainNetwork}
            isLoading={isLoading}
          />
          <NetworkStatus
            name={NETWORK.SOROBAN_TESTNET}
            isOperational={!!data?.testNetwork}
            isLoading={isLoading}
          />
          <NetworkStatus
            name={NETWORK.SOROBAN_FUTURENET}
            isOperational={!!data?.futureNetwork}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
