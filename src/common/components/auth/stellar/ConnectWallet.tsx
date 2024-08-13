import { Button } from '../../ui/button';

import { NETWORK } from '@/common/types/soroban.enum';
import { IWalletContent } from '@/modules/auth/interfaces/IAuthenticationContext';

interface IConnectWallet {
	connectWallet: (network: NETWORK) => void;
	wallet: {
		MAINNET: IWalletContent | null;
		TESTNET: IWalletContent | null;
		FUTURENET: IWalletContent | null;
	};
	disconnectWallet: () => void;
	network: string;
}

function ConnectWallet({
	wallet,
	connectWallet,
	disconnectWallet,
	network,
}: IConnectWallet) {
	return wallet[network as keyof typeof wallet] ? (
		<Button
			className="font-bold px-10 border-[3px] border-primary text-primary h-full hover:text-background hover:bg-primary"
			variant="outline"
			data-test="auth-stellar-disconnect-account-btn"
			onClick={disconnectWallet}
		>
			Disconnet Account
		</Button>
	) : (
		<Button
			className="font-bold px-10 border-[3px] border-primary text-primary h-full hover:text-background hover:bg-primary"
			variant="outline"
			data-test="auth-stellar-connect-account-btn"
			onClick={() => connectWallet(network as NETWORK)}
		>
			Connect Account
		</Button>
	);
}

export default ConnectWallet;
