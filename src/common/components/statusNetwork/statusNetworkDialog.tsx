import { Button } from '../ui/button';
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
  const { data, isLoading, refetch, isRefetching } = useStatusNetworkQuery();

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
            isLoading={isLoading || isRefetching}
          />
          <NetworkStatus
            name={NETWORK.SOROBAN_TESTNET}
            isOperational={!!data?.testNetwork}
            isLoading={isLoading || isRefetching}
          />
          <NetworkStatus
            name={NETWORK.SOROBAN_FUTURENET}
            isOperational={!!data?.futureNetwork}
            isLoading={isLoading || isRefetching}
          />
        </div>
        <Button
          onClick={() => refetch()}
          variant="outline"
          className="w-auto px-8 py-3 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          disabled={isLoading || isRefetching}
        >
          {isLoading ? 'Reloading...' : 'Reload Status'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
