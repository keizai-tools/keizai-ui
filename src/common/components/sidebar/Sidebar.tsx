import { Container, LibraryBig } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import ConnectWalletDialog from '../connectWallet/connectWalletDialog';
import StatusNetworkDialog from '../statusNetwork/statusNetworkDialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import EphemeralContentDialog from './EphemeralcontentDialog';
import NetworkButton from './NetworkButton';
import UserButton from './UserButton';

import { useStatusNetworkQuery } from '@/common/api/statusNetwork';
import { useEphemeral } from '@/common/hooks/useEphemeral';
import { useAuthProvider } from '@/modules/auth/hooks/useAuthProvider';

export default function Sidebar() {
  const { wallet } = useAuthProvider();
  const { data, isLoading } = useStatusNetworkQuery();

  const [openConnectWallet, setOpenConnectWallet] = useState(false);
  const [openNetworkStatus, setOpenNetworkStatus] = useState(false);
  const [openEphemeralDialog, setOpenEphemeralDialog] = useState(false);

  const [loading, setLoading] = useState(false);
  const {
    status,
    handleStart,
    handleStop,
    isError,
    isLoading: isEphemeralLoading,
    setEphemeral,
  } = useEphemeral(setLoading);

  const location = useLocation();
  const currentRoute = location.pathname;

  const wallets = [wallet.FUTURENET, wallet.MAINNET, wallet.TESTNET];
  const nullWalletsCount = wallets.filter((w) => w === null).length;

  let walletColor = 'text-green-300';
  if (nullWalletsCount >= 2) {
    walletColor = 'text-red-300';
  } else if (nullWalletsCount > 0) {
    walletColor = 'text-orange-300';
  }

  let globeColor = 'text-green-300';
  if (isLoading) {
    globeColor = 'text-yellow-300';
  } else if (data) {
    const { futureNetwork, testNetwork, mainNetwork } = data;
    if (!futureNetwork || !testNetwork || !mainNetwork) {
      globeColor = 'text-red-300';
    }
  }

  const handleOpenEphemeralDialog = () => setOpenEphemeralDialog(true);
  const handleCloseEphemeralDialog = () => setOpenEphemeralDialog(false);

  return (
    <div
      className="h-screen w-[80px] flex flex-col items-center justify-between bg-foreground dark:bg-background border-r dark:border-r-border py-4"
      data-test="sidebar-container"
    >
      <div className="flex flex-col items-center">
        <img
          src="/logo.svg"
          width={45}
          height={45}
          alt="Keizai Logo"
          data-test="sidebar-img"
        />
        <Badge className="mt-2 select-none">BETA</Badge>
        <div className="flex flex-col items-center gap-6 mt-6">
          <Link
            to="/"
            data-test="sidebar-link"
            className={`hover:text-primary ${
              currentRoute === '/' && 'text-primary'
            }`}
          >
            <LibraryBig data-test="sidebar-btn-copy" />
          </Link>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-4 mb-4">
        <Tooltip delayDuration={100}>
          <TooltipTrigger>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant="outline"
                  size="icon"
                  data-test="sidebar-btn-user"
                >
                  <Container
                    onClick={handleOpenEphemeralDialog}
                    className=" transition-colors duration-300 cursor-pointer hover:text-primary active:text-primary"
                  />
                </Button>

                <EphemeralContentDialog
                  open={openEphemeralDialog}
                  onOpenChange={handleCloseEphemeralDialog}
                  loading={loading || isEphemeralLoading}
                  error={isError ? 'Error managing ephemeral instance' : null}
                  status={status}
                  setEphemeral={setEphemeral}
                  handleStart={handleStart}
                  handleStop={handleStop}
                />
              </DropdownMenuTrigger>
            </DropdownMenu>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Ephimeral Environment</p>
          </TooltipContent>
        </Tooltip>
        <NetworkButton
          globeColor={globeColor}
          walletColor={walletColor}
          setOpenConnectWallet={setOpenConnectWallet}
          setOpenNetworkStatus={setOpenNetworkStatus}
        />
        <UserButton />
      </div>
      {openConnectWallet && (
        <ConnectWalletDialog
          open={openConnectWallet}
          onOpenChange={(open: boolean) => setOpenConnectWallet(open)}
        />
      )}
      {openNetworkStatus && (
        <StatusNetworkDialog
          open={openNetworkStatus}
          onOpenChange={(open: boolean) => setOpenNetworkStatus(open)}
        />
      )}
    </div>
  );
}
