import React from 'react';
import { useForm } from 'react-hook-form';

import ConnectWallet from '../../stellar/connectWallet';
import CreateNewAccount from '../../stellar/createNewAccount';
import { Input } from '../../ui/input';

import { useEditInvocationKeysMutation } from '@/common/api/invocations';
import { NETWORK } from '@/common/types/soroban.enum';
import { useAuthProvider } from '@/modules/auth/hooks/useAuthProvider';
import { IKeypair } from '@/modules/stellar/domain/keypair';

function AuthorizationTab({
	invocationId,
	network,
	defaultValues,
}: Readonly<{
	invocationId: string;
	network: string;
	defaultValues: IKeypair;
}>) {
	const { connectWallet, wallet, disconnectWallet } = useAuthProvider();

	const { mutate: editKeys, data } = useEditInvocationKeysMutation();
	const { register } = useForm({
		defaultValues: {
			secretKey: defaultValues.secretKey,
			publicKey: defaultValues.publicKey,
		},
	});

	const defaultKeys = React.useMemo(() => {
		return {
			secretKey: data?.secretKey ?? defaultValues.secretKey,
			publicKey: data?.publicKey ?? defaultValues.publicKey,
		};
	}, [data, defaultValues]);

	React.useEffect(() => {
		if (wallet) {
			editKeys({
				id: invocationId,
				publicKey: wallet[network as keyof typeof wallet]?.publicKey ?? '',
				secretKey: '',
			});
		}
	}, [wallet, invocationId, editKeys, network]);

	return (
		<section data-test="auth-tab-container">
			<div
				className="flex flex-col gap-2 px-1 py-5"
				data-test="auth-tab-keypair-container"
			>
				{!wallet && (
					<div className="flex flex-col gap-1" data-test="auth-tab-secret-key">
						<span className="font-semibold text-primary text-md">
							Secret key
						</span>
						<Input
							{...register('secretKey')}
							placeholder="S . . ."
							value={defaultKeys.secretKey ?? ''}
							className="pointer-events-none"
						/>
					</div>
				)}
				<div className="flex flex-col gap-1" data-test="auth-tab-public-key">
					<span className="font-semibold text-primary text-md">Public key</span>
					<Input
						{...register('publicKey')}
						placeholder="G . . ."
						value={defaultKeys.publicKey ?? ''}
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
					disconnectWallet={disconnectWallet}
					network={network}
				/>
			</div>
		</section>
	);
}

export default AuthorizationTab;
