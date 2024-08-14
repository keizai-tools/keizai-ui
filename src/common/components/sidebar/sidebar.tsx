import { LibraryBig, Globe, Wallet } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import ConnectWalletDialog from '../connectWallet/connectWalletDialog';
import StatusNetworkDialog from '../statusNetwork/statusNetworkDialog';
import { Badge } from '../ui/badge';
import UserButton from './userButton';

export default function Sidebar() {
	const [openConnectWallet, setOpenConnectWallet] = useState(false);
	const [openNetworkStatus, setOpenNetworkStatus] = useState(false);
	const location = useLocation();
	const currentRoute = location.pathname;
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
					<Globe
						className="cursor-pointer hover:text-primary"
						onClick={() => setOpenNetworkStatus(true)}
						data-test="sidebar-btn-network-status"
					/>
					<Wallet
						className="cursor-pointer hover:text-primary"
						onClick={() => setOpenConnectWallet(true)}
						data-test="sidebar-btn-wallet"
					/>
				</div>
			</div>
			<div className="flex flex-col gap-2 mb-4">
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
