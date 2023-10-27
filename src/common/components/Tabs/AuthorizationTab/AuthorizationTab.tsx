import debounce from 'lodash.debounce';
import React from 'react';
import { useForm } from 'react-hook-form';

import CreateNewAccount from '../../auth/stellar/CreateNewAccount';
import ImportAccount from '../../auth/stellar/ImportAccount';
import { Input } from '../../ui/input';

import { useEditInvocationKeysMutation } from '@/common/api/invocations';
import { IKeypair } from '@/services/stellar/domain/keypair';

const AuthorizationTab = ({
	invocationId,
	defaultValues,
}: {
	invocationId: string;
	defaultValues: IKeypair;
}) => {
	const [account, setAccount] = React.useState<IKeypair>(defaultValues);
	const { mutate: editKeys } = useEditInvocationKeysMutation();
	const { register, reset, formState, watch } = useForm({
		defaultValues: {
			secretKey: defaultValues.secretKey,
			publicKey: defaultValues.publicKey,
		},
	});
	const data = watch();

	const debounceKeyPhrase = React.useMemo(
		() =>
			debounce((value) => {
				editKeys({
					id: invocationId,
					secretKey: value.secretKey,
					publicKey: value.publicKey,
				});
				reset({
					secretKey: value.secretKey,
					publicKey: value.publicKey,
				});
			}, 500),
		[editKeys, invocationId, reset],
	);

	React.useEffect(() => {
		if (formState.isDirty) {
			debounceKeyPhrase(data);
		}
	}, [data, debounceKeyPhrase, formState.isDirty]);

	return (
		<section data-test="auth-tab-container">
			<div
				className="flex flex-col gap-2 p-12"
				data-test="auth-tab-keypair-container"
			>
				<div className="flex flex-col gap-1" data-test="auth-tab-secret-key">
					<span className="text-primary text-md font-semibold">Secret key</span>
					<Input
						{...register('secretKey')}
						placeholder="S . . ."
						value={account.secretKey || ''}
					/>
				</div>
				<div className="flex flex-col gap-1" data-test="auth-tab-public-key">
					<span className="text-primary text-md font-semibold">Public key</span>
					<Input
						{...register('publicKey')}
						placeholder="G . . ."
						value={account.publicKey || ''}
					/>
				</div>
			</div>
			<div className="flex justify-center gap-4 h-12 w-[90%] px-4">
				<CreateNewAccount setAccount={setAccount} />
				<ImportAccount setAccount={setAccount} />
			</div>
		</section>
	);
};

export default AuthorizationTab;
