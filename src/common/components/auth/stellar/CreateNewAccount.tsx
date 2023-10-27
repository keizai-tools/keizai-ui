import React from 'react';

import { Button } from '../../ui/button';

import { IKeypair } from '@/services/stellar/domain/keypair';
import useStellar from '@/services/stellar/hook/useStellar';

function CreateNewAccount({
	setAccount,
}: {
	setAccount: React.Dispatch<React.SetStateAction<IKeypair>>;
}) {
	const { createNewAccount } = useStellar();

	const onCreateAccount = () => {
		const keypair = createNewAccount();
		if (keypair) {
			setAccount(keypair);
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
