import React from 'react';
import { useForm } from 'react-hook-form';

import CreateNewAccount from '../../auth/stellar/CreateNewAccount';
import ImportAccount from '../../auth/stellar/ImportAccount';
import { Input } from '../../ui/input';

import { useEditInvocationKeysMutation } from '@/common/api/invocations';
import { NETWORK } from '@/common/types/soroban.enum';
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

	return (
		<section data-test="auth-tab-container">
			<div
				className="flex flex-col gap-2 px-1 py-5"
				data-test="auth-tab-keypair-container"
			>
				<div className="flex flex-col gap-1" data-test="auth-tab-secret-key">
					<span className="text-primary text-md font-semibold">Secret key</span>
					<Input
						{...register('secretKey')}
						placeholder="S . . ."
						value={defaultKeys.secretKey || ''}
						className="pointer-events-none"
					/>
				</div>
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
				{network !== NETWORK.SOROBAN_MAINNET && (
					<CreateNewAccount
						invocationId={invocationId}
						editKeys={editKeys}
						network={network}
					/>
				)}
				<ImportAccount invocationId={invocationId} editKeys={editKeys} />
			</div>
		</section>
	);
};

export default AuthorizationTab;
