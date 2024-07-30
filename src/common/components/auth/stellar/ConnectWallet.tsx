import { Network } from 'simple-stellar-signer-api';

import { Button } from '../../ui/button';

import { IWallet } from '@/services/auth/hook/useAuth';

interface IConnectWallet {
	connectWallet: (network: Network) => void;
	wallet?: IWallet | null;
	disconnectWallet: () => void;
	network: string;
}

function ConnectWallet({
	wallet,
	connectWallet,
	disconnectWallet,
	network,
}: IConnectWallet) {
	return wallet ? (
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
			onClick={() => connectWallet(network.toLowerCase() as Network)}
		>
			Connect Account
		</Button>
	);
}

export default ConnectWallet;
