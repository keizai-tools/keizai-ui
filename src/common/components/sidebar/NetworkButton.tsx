import { Link, Globe, Wallet } from 'lucide-react';

import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

function NetworkButton({
  globeColor,
  setOpenNetworkStatus,
  walletColor,
  setOpenConnectWallet,
}: {
  globeColor: string;
  setOpenNetworkStatus: (value: boolean) => void;
  walletColor: string;
  setOpenConnectWallet: (value: boolean) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          asChild
          data-test="sidebar-btn-user"
          tooltip="Network Status"
        >
          <Link className="p-2 transition-colors duration-300 cursor-pointer hover:text-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="right"
        align="end"
        data-test="user-dropdown-container"
      >
        <DropdownMenuItem
          data-test="user-dropdown-change-password"
          className="flex items-center gap-2 py-2 pr-8 cursor-pointer"
          onClick={() => setOpenNetworkStatus(true)}
        >
          <Globe
            className={`text-gray-400 ${globeColor} transition-colors duration-300 cursor-pointer hover:text-primary active:text-primary`}
            data-test="sidebar-btn-network-status"
          />

          <span>Network Status</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          data-test="user-dropdown-log-out"
          className="flex items-center gap-2 py-2 pr-8 mt-1 cursor-pointer"
          onClick={() => setOpenConnectWallet(true)}
        >
          <Wallet
            className={`text-gray-400 ${walletColor}  transition-colors duration-300 cursor-pointer hover:text-primary active:text-primary`}
            data-test="sidebar-btn-wallet"
          />
          <span>Wallet Status</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NetworkButton;
