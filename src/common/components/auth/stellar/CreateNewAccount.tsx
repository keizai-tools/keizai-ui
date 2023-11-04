import { UseMutateFunction } from '@tanstack/react-query';

import { Button } from '../../ui/button';

import useStellar from '@/services/stellar/hook/useStellar';

function CreateNewAccount({
	invocationId,
	editKeys,
}: {
	invocationId: string;
	editKeys: UseMutateFunction<
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		any,
		Error,
		{
			id: string;
			secretKey?: string | undefined;
			publicKey?: string | undefined;
		},
		unknown
	>;
}) {
	const { createNewAccount } = useStellar();

	const onCreateAccount = () => {
		const keypair = createNewAccount();
		if (keypair) {
			fetch(
				`https://friendbot-futurenet.stellar.org/?addr=${keypair.publicKey}`,
			);
			editKeys({ id: invocationId, ...keypair });
		}
	};
	return (
		<Button
			className="font-bold px-10 border-[3px] border-primary text-primary h-full hover:text-background hover:bg-primary"
			variant="outline"
			data-test="auth-stellar-create-account-btn"
			onClick={onCreateAccount}
		>
			Generate new account
		</Button>
	);
}

export default CreateNewAccount;
