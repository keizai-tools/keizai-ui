import { UseMutateFunction } from '@tanstack/react-query';

import { Button } from '../../ui/button';

import useStellar from '@/common/hooks/useStellar';
import { NETWORK } from '@/common/types/soroban.enum';

function CreateNewAccount({
  invocationId,
  network,
  editKeys,
}: Readonly<{
  invocationId: string;
  network: NETWORK;
  editKeys: UseMutateFunction<
    unknown,
    Error,
    {
      id: string;
      secretKey?: string;
      publicKey?: string;
    },
    unknown
  >;
}>) {
  const { createNewAccount, fundingAccount } = useStellar();

  const onCreateAccount = () => {
    const keypair = createNewAccount();
    if (keypair) {
      fundingAccount({
        publicKey: keypair.publicKey as string,
        network,
      });
      editKeys({ id: invocationId, ...keypair });
      if (window.umami) window.umami.track('Create new account');
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
