import { Fragment, useEffect, useState } from 'react';

import SelectInterval from '../../Input/SelectInterval';
import ConnectWalletDialog from '../../connectWallet/connectWalletDialog';
import { Button } from '../../ui/button';

import { StoredCookies } from '@/modules/cookies/interfaces/cookies.enum';
import { cookieService } from '@/modules/cookies/services/cookie.service';
import { userService } from '@/modules/user/services/user.service';

export default function EphemeralContent({
  status,
  handleStart,
  handleStop,
  loading,
}: Readonly<{
  error: string | null;
  status?: {
    status: string;
    taskArn: string;
    isEphemeral: boolean;
  };
  handleStart: (options: { interval: number }) => void;
  handleStop: () => void;
  loading: boolean;
  setEphemeral: (status: boolean) => void;
}>) {
  const [balance, setBalance] = useState<number>(0);
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState<number | null>(null);

  useEffect(() => {
    async function fetchBalance() {
      const response = await userService.UserMe();
      setBalance(response.payload.balance);
    }
    fetchBalance();
  }, []);

  if (balance <= 0) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-lg font-bold text-red-500">
          You do not have a sufficient balance for the ephemeral environment.
        </p>
        <Button
          type="button"
          className="px-4 py-2 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105"
          onClick={() => setIsWalletDialogOpen(true)}
        >
          Recharge Balance
        </Button>
        {isWalletDialogOpen && (
          <ConnectWalletDialog
            open={isWalletDialogOpen}
            onOpenChange={(open) => setIsWalletDialogOpen(open)}
          />
        )}
      </div>
    );
  }

  const handleStartClick = async () => {
    if (selectedInterval !== null) {
      try {
        const userId = cookieService.getCookie(StoredCookies.USER_ID);
        if (userId === undefined) {
          console.error('User ID cookie not found');
          return;
        }
        await userService.updateUserBalance(selectedInterval);
        handleStart({ interval: selectedInterval });
      } catch (error) {
        console.error('Error updating user balance:', error);
      }
    }
  };

  return (
    <Fragment>
      <div className="flex flex-col w-full h-full gap-6 p-6 font-bold border-2 border-solid rounded-lg border-offset-background bg-slate-900">
        <div className="flex items-center justify-between w-full gap-2">
          <span className="text-base text-gray-500 ">Ephemeral Status:</span>
          <span
            className={`text-sm ${
              status?.status === 'STOPPED' ? 'text-red-500' : 'text-green-500'
            }`}
          >
            {status?.status}
          </span>
        </div>
      </div>
      <div className="flex flex-col w-full h-full gap-6 p-6 font-bold border-2 border-solid rounded-lg border-offset-background">
        {status?.status === 'STOPPED' ? (
          <>
            <SelectInterval
              interval={selectedInterval}
              setInterval={setSelectedInterval}
            />
            <Button
              type="submit"
              className="px-4 py-2 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105"
              data-test="edit-entity-dialog-btn-submit"
              onClick={handleStartClick}
              disabled={loading || selectedInterval === null}
            >
              {loading ? 'Starting...' : 'Start Ephemeral'}
            </Button>
          </>
        ) : (
          <Button
            type="submit"
            className="px-4 py-2 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105"
            variant="outline"
            data-test="edit-entity-dialog-btn-submit"
            onClick={() => {
              handleStop();
            }}
            disabled={loading}
          >
            {loading ? 'Stopping...' : 'Stop Ephemeral'}
          </Button>
        )}
      </div>
    </Fragment>
  );
}
