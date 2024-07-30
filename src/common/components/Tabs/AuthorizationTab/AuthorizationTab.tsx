import React from 'react';
import { useForm } from 'react-hook-form';

import ConnectWallet from '../../auth/stellar/ConnectWallet';
import CreateNewAccount from '../../auth/stellar/CreateNewAccount';
import { Input } from '../../ui/input';

import { useEditInvocationKeysMutation } from '@/common/api/invocations';
import { NETWORK } from '@/common/types/soroban.enum';
import { useAuth } from '@/services/auth/hook/useAuth';
import { IKeypair } from '@/services/stellar/domain/keypair';

const AuthorizationTab = ({
	invocationId,
	network,
	defaultValues,
}: {
	invocationId: string;
	network: string;
	defaultValues: IKeypair;
}) => {
	const { connectWallet, wallet, setDisconnectWallet } = useAuth();

	const { mutate: editKeys, data } = useEditInvocationKeysMutation();
	const { register } = useForm({
		defaultValues: {
			secretKey: defaultValues.secretKey,
			publicKey: defaultValues.publicKey,
		},
	});

	const defaultKeys = React.useMemo(() => {
		return {
			secretKey: data?.secretKey || defaultValues.secretKey,
			publicKey: data?.publicKey || defaultValues.publicKey,
		};
	}, [data, defaultValues]);

	React.useEffect(() => {
		if (wallet) {
			editKeys({
				id: invocationId,
				publicKey: wallet.publicKey,
				secretKey: '',
			});
		}
	}, [wallet, invocationId, editKeys]);

	return (
		<section data-test="auth-tab-container">
			<div
				className="flex flex-col gap-2 px-1 py-5"
				data-test="auth-tab-keypair-container"
			>
				{!wallet && (
					<div className="flex flex-col gap-1" data-test="auth-tab-secret-key">
						<span className="text-primary text-md font-semibold">
							Secret key
						</span>
						<Input
							{...register('secretKey')}
							placeholder="S . . ."
							value={defaultKeys.secretKey || ''}
							className="pointer-events-none"
						/>
					</div>
				)}
				<div className="flex flex-col gap-1" data-test="auth-tab-public-key">
					<span className="text-primary text-md font-semibold">Public key</span>
					<Input
						{...register('publicKey')}
						placeholder="G . . ."
						value={defaultKeys.publicKey || ''}
						className="pointer-events-none"
					/>
				</div>
			</div>
			<div className="flex justify-end gap-4 px-2">
				{!wallet && network !== NETWORK.SOROBAN_MAINNET && (
					<CreateNewAccount
						invocationId={invocationId}
						editKeys={editKeys}
						network={network}
					/>
				)}
				<ConnectWallet
					wallet={wallet}
					connectWallet={connectWallet}
					disconnectWallet={setDisconnectWallet}
					network={network}
				/>
			</div>
		</section>
	);
};

export default AuthorizationTab;
