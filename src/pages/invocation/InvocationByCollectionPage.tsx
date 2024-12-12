import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useFoldersByCollectionIdQuery } from '@/common/api/folders';
import { useEditInvocationKeysMutation } from '@/common/api/invocations';
import Breadcrumb from '@/common/components/Breadcrumb/Breadcrumb';
import ContractInput from '@/common/components/Input/ContractInput';
import { Invocation } from '@/common/types/invocation';
import { useAuthProvider } from '@/modules/auth/hooks/useAuthProvider';
import useInvocationHandlers from '@/modules/invocation/hooks/useInvocation';

function InvocationByCollectionPage({
  invocation,
}: Readonly<{
  invocation: Invocation;
}>) {
  return <InvocationPageContent invocation={invocation} />;
}

export default InvocationByCollectionPage;

function InvocationPageContent({
  invocation,
}: Readonly<{ invocation: Invocation }>) {
  const { mutate: editKeys } = useEditInvocationKeysMutation();
  const { wallet, statusState, connectWallet } = useAuthProvider();
  const params = useParams();
  const { data } = useFoldersByCollectionIdQuery({
    id: params.collectionId,
  });
  const {
    handleLoadContract,
    isLoadingContract,
    handleRunInvocation,
    isRunningInvocation,
  } = useInvocationHandlers(invocation, wallet, connectWallet);

  useEffect(() => {
    if (wallet[invocation.network as keyof typeof wallet]) {
      editKeys({
        id: invocation.id,
        publicKey:
          wallet[invocation.network as keyof typeof wallet]?.publicKey ?? '',
        secretKey:
          wallet[invocation.network as keyof typeof wallet]?.privateKey ?? '',
      });
    }
  }, [invocation.id, invocation.network, editKeys, wallet]);
  const folderName = data?.find(
    (folder) => folder.id === invocation.folderId,
  )?.name;
  return (
    <div
      className="flex flex-col w-full max-h-screen gap-4 p-3 overflow-hidden "
      data-test="invocation-section-container"
    >
      <Breadcrumb
        contractName="Collection"
        folderName={folderName ?? ''}
        contractInvocationName={invocation.name}
        contractInvocationId={invocation.id}
      />
      <ContractInput
        defaultValue={invocation.contractId ?? ''}
        defaultNetwork={invocation.network}
        loadContract={handleLoadContract}
        runInvocation={handleRunInvocation}
        method={invocation.selectedMethod}
        loading={
          isLoadingContract || isRunningInvocation || statusState.wallet.loading
        }
        viewMode={true}
        invocationID={invocation.id}
      />
    </div>
  );
}
