import { Container, LibraryBig } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import ConnectWalletDialog from '../connectWallet/connectWalletDialog';
import StatusNetworkDialog from '../statusNetwork/statusNetworkDialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import EphemeralContentDialog from './EphemeralcontentDialog';
import NetworkButton from './NetworkButton';
import UserButton from './UserButton';
import WasmFilesDialog from './WasmFilesDialog';

import { useStatusNetworkQuery } from '@/common/api/statusNetwork';
import { useEphemeralProvider } from '@/common/context/useEphemeralContext';
import { useAuthProvider } from '@/modules/auth/hooks/useAuthProvider';

export default function Sidebar() {
  const { wallet } = useAuthProvider();
  const { data, isLoading } = useStatusNetworkQuery();

  const [dialogs, setDialogs] = useState({
    connectWallet: false,
    networkStatus: false,
    ephemeral: false,
    wasmFiles: false,
  });

  const { countdown } = useEphemeralProvider();
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

  function handleDialogToggle(dialogName: string, isOpen: boolean) {
    setDialogs((prev) => ({ ...prev, [dialogName]: isOpen }));
  }

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
        <Button
          variant="outline"
          size="icon"
          asChild
          data-test="sidebar-btn-user"
          onClick={() => handleDialogToggle('ephemeral', true)}
          tooltip="Ephemeral Container"
        >
          <Container
            className={`p-2 transition-colors duration-300 cursor-pointer hover:text-primary ${countdown.countdownColor}`}
            data-test="sidebar-btn-ephemeral"
          />
        </Button>
        <Button
          variant="outline"
          size="icon"
          asChild
          data-test="sidebar-btn-wasm"
          onClick={() => handleDialogToggle('wasmFiles', true)}
          tooltip="Wasm Files"
        >
          <LibraryBig
            className="p-2 transition-colors duration-300 cursor-pointer hover:text-primary"
            data-test="sidebar-btn-wasm"
          />
        </Button>

        <NetworkButton
          globeColor={globeColor}
          walletColor={walletColor}
          setOpenConnectWallet={() => handleDialogToggle('connectWallet', true)}
          setOpenNetworkStatus={() => handleDialogToggle('networkStatus', true)}
        />
        <UserButton />
      </div>
      {dialogs.wasmFiles && (
        <WasmFilesDialog
          open={dialogs.wasmFiles}
          onOpenChange={() =>
            handleDialogToggle('wasmFiles', !dialogs.wasmFiles)
          }
        />
      )}
      {dialogs.ephemeral && (
        <EphemeralContentDialog
          open={dialogs.ephemeral}
          onOpenChange={() =>
            handleDialogToggle('ephemeral', !dialogs.ephemeral)
          }
        />
      )}
      {dialogs.connectWallet && (
        <ConnectWalletDialog
          open={dialogs.connectWallet}
          onOpenChange={() =>
            handleDialogToggle('connectWallet', !dialogs.connectWallet)
          }
        />
      )}
      {dialogs.networkStatus && (
        <StatusNetworkDialog
          open={dialogs.networkStatus}
          onOpenChange={() =>
            handleDialogToggle('networkStatus', !dialogs.networkStatus)
          }
        />
      )}
    </div>
  );
}
