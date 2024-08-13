import { Fragment, useState } from 'react';

import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

import { NETWORK } from '@/common/types/soroban.enum';

interface NetworkConnectionButtonProps {
	network: NETWORK;
	isConnected: boolean;
	connectWallet: (network: NETWORK) => void;
	disconnectWallet: (network?: Partial<NETWORK>) => void;
	autoGenerated?: boolean;
}

export function NetworkConnectionButton({
	network,
	isConnected,
	connectWallet,
	disconnectWallet,
	autoGenerated,
}: Readonly<NetworkConnectionButtonProps>) {
	const [showWarning, setShowWarning] = useState(false);

	const handleClick = () => {
		if (autoGenerated || !isConnected) {
			connectWallet(network);
		} else {
			setShowWarning(true);
		}
	};

	const handleConfirmDisconnect = () => {
		setShowWarning(false);
		disconnectWallet(network);
	};

	const handleCancelDisconnect = () => {
		setShowWarning(false);
	};

	return (
		<Fragment>
			<Button
				onClick={handleClick}
				variant="outline"
				className="px-8 py-3 font-bold transition-all duration-300 ease-in-out transform border-2 whitespace-nowrap hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
			>
				{autoGenerated || !isConnected ? 'Connect Wallet' : 'Disconnect Wallet'}
			</Button>

			<Dialog open={showWarning} onOpenChange={setShowWarning}>
				<DialogContent className="flex flex-col w-auto h-auto gap-4 p-6 font-bold border-2 border-solid rounded-lg border-offset-background max-w-prose">
					<DialogHeader>
						<DialogTitle className="text-xl font-semibold select-none">
							Warning
						</DialogTitle>
					</DialogHeader>
					<p>
						It looks like this wallet is not autogenered. Are you sure you want
						to disconnect it?
					</p>
					<div className="flex gap-4 mt-4">
						<Button
							onClick={handleConfirmDisconnect}
							className="px-4 py-2 font-bold transition-all duration-300 ease-in-out transform border-2 hover:scale-105"
							variant="outline"
						>
							Yes, Disconnect
						</Button>
						<Button
							onClick={handleCancelDisconnect}
							className="px-4 py-2 font-bold transition-all duration-300 ease-in-out transform border-2 hover:scale-105"
							variant="outline"
						>
							Cancel
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</Fragment>
	);
}
