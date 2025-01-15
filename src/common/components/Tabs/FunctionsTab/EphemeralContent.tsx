import { Loader } from 'lucide-react';
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
  formattedCountdown,
  countdownColor,
}: Readonly<{
  error: string | null;
  status?: {
    status: string;
    taskArn: string;
    publicIp: string;
    taskStartedAt: string;
    taskStoppedAt: string;
    executionInterval: number;
    isEphemeral: boolean;
  };
  formattedCountdown: string;
  countdown: number | null;
  countdownColor: string;
  handleStart: (options: { interval: number }) => void;
  handleStop: () => void;
  loading: boolean;
  setEphemeral: (status: boolean) => void;
}>) {
  const [balance, setBalance] = useState<number>(0);
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState<number | null>(null);
  const [isBalanceLoading, setIsBalanceLoading] = useState(true);

  useEffect(() => {
    async function fetchBalance() {
      setIsBalanceLoading(true);
      const response = await userService.UserMe();
      setBalance(response.payload.balance);
      setIsBalanceLoading(false);
    }
    fetchBalance();
  }, []);

  if (isBalanceLoading) {
    return (
      <div
        className="w-full h-full inset-0 flex flex-col items-center justify-center z-[100000] backdrop-blur-sm pointer-events-auto"
        style={{
          backgroundColor: `hsla(222.2, 84%, 4.9%, 0.8)`,
          pointerEvents: 'none',
        }}
      >
        <Loader className="mb-4 animate-spin" size="36" />
        <p className="text-lg text-center text-white">
          Fetching your balance...
        </p>
      </div>
    );
  }

  if (balance <= 0) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-lg font-bold text-red-400">
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

  async function handleStartClick() {
    if (selectedInterval !== null) {
      try {
        const userId = cookieService.getCookie(StoredCookies.USER_ID);
        if (userId === undefined) {
          console.error('User ID cookie not found');
          return;
        }
        handleStart({ interval: selectedInterval });
      } catch (error) {
        console.error('Error updating user balance:', error);
      }
    }
  }

  return (
    <Fragment>
      <div className="flex flex-col w-full h-full p-6 font-bold border-2 border-solid rounded-lg border-offset-background bg-slate-900">
        <div className="flex items-center justify-between w-full gap-2">
          <span className="text-base text-gray-400">Ephemeral Status:</span>
          <span
            className={`text-sm ${
              status?.status === 'STOPPED' ? 'text-red-400' : 'text-green-400'
            }`}
          >
            {status?.status}
          </span>
        </div>
        {status?.status !== 'STOPPED' && status && (
          <div>
            <div className="flex items-center justify-between w-full gap-2">
              <span className="text-base text-gray-400">Started At:</span>
              <span className="text-sm">
                {new Date(status.taskStartedAt).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between w-full gap-2">
              <span className="text-base text-gray-400">Will Stop At:</span>
              <span className="text-sm">
                {new Date(
                  new Date(status.taskStartedAt).getTime() +
                    status.executionInterval * 60000,
                ).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between w-full gap-2">
              <span className="text-base text-gray-400">Countdown:</span>
              <span className={`text-sm ${countdownColor}`}>
                {formattedCountdown}
              </span>
            </div>
            <div className="flex items-center justify-between w-full gap-2">
              <span className="text-base text-gray-400">
                Selected Interval:
              </span>
              <span className="text-sm">
                {status.executionInterval} minutes
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col w-full h-full gap-6 p-6 font-bold border-2 border-solid rounded-lg border-offset-background">
        {status?.status === 'STOPPED' ? (
          <div
            className="flex items-center justify-between w-full gap-2"
            data-test="edit-entity-dialog-interval"
          >
            <SelectInterval
              interval={selectedInterval}
              setInterval={setSelectedInterval}
            />
            <Button
              type="submit"
              className="w-auto px-4 py-3 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              data-test="edit-entity-dialog-btn-submit"
              onClick={handleStartClick}
              disabled={loading || selectedInterval === null}
            >
              {loading ? 'Starting...' : 'Start Ephemeral'}
            </Button>
          </div>
        ) : (
          <Button
            type="submit"
            className="w-auto px-4 py-3 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
