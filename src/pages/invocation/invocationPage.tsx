import { Loader } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import InvocationCTAPage from './invocationCTAPage';

import {
  useEditInvocationKeysMutation,
  useInvocationQuery,
} from '@/common/api/invocations';
import Breadcrumb from '@/common/components/Breadcrumb/Breadcrumb';
import ContractInput from '@/common/components/Input/ContractInput';
import UploadWasmDialog from '@/common/components/Tabs/FunctionsTab/UploadWasmDialog';
import TabsContainer from '@/common/components/Tabs/TabsContainer';
import Terminal from '@/common/components/ui/Terminal';
import useWasmFileHandler from '@/common/hooks/useUploadWasm';
import { Invocation } from '@/common/types/invocation';
import { NETWORK } from '@/common/types/soroban.enum';
import { useAuthProvider } from '@/modules/auth/hooks/useAuthProvider';
import { IWallet } from '@/modules/auth/interfaces/IAuthenticationContext';
import { IStatusState } from '@/modules/auth/interfaces/IStatusState';

function InvocationPage() {
  const params = useParams();
  const { data, isLoading, isRefetching, error } = useInvocationQuery({
    id: params.invocationId,
  });

  const [loading, setLoading] = useState(false);
  const { mutate: editKeys } = useEditInvocationKeysMutation();
  const { wallet, statusState, connectWallet } = useAuthProvider();

  useEffect(() => {
    if (data?.contractId && data?.methods?.length) {
      setLoading(false);
    }
  }, [data, data?.contractId, setLoading]);

  useEffect(() => {
    console.log({
      wallet: wallet[data?.network as keyof typeof wallet],
      data,
      wallets: wallet,
    });
    if (data && wallet[data.network as keyof typeof wallet]) {
      editKeys({
        id: data.id,
        publicKey: wallet[data.network as keyof typeof wallet]?.publicKey ?? '',
        secretKey:
          wallet[data.network as keyof typeof wallet]?.privateKey ?? '',
        network: data.network,
      });
    }
  }, [
    data,
    data?.contractId,
    data?.id,
    data?.network,
    editKeys,
    setLoading,
    wallet,
  ]);

  if (isLoading || isRefetching) {
    return (
      <div className="flex items-center justify-center flex-1 w-full h-full">
        <Loader className="animate-spin" size="36" />
      </div>
    );
  }

  if (error) {
    return <Navigate to="/collection" replace={true} />;
  }

  if (!data) {
    return null;
  }

  return (
    <InvocationPageContent
      data={data}
      setLoading={setLoading}
      wallet={wallet}
      connectWallet={connectWallet}
      statusState={statusState}
      loading={loading}
    />
  );
}

export default InvocationPage;

function InvocationPageContent({
  data,
  setLoading,
  wallet,
  loading,
  connectWallet,
  statusState,
}: Readonly<{
  loading: boolean;
  data: Invocation;
  wallet: IWallet;
  statusState: IStatusState;
  connectWallet: (network: Partial<NETWORK>) => Promise<void>;
  setLoading: (loading: boolean) => void;
}>) {
  const uploadWasm = useWasmFileHandler(
    data,
    wallet,
    setLoading,
    connectWallet,
    loading,
  );

  return (
    <Fragment>
      <div
        className="relative flex flex-col w-full max-h-screen gap-4 p-3 overflow-hidden"
        data-test="invocation-section-container"
      >
        <Breadcrumb
          contractName="Collection"
          folderName={data.folder?.name ?? ''}
          contractInvocationName={data.name}
        />
        <ContractInput
          defaultValue={data.contractId ?? ''}
          defaultNetwork={data.network}
          loadContract={uploadWasm.handleLoadContract}
          runInvocation={uploadWasm.handleRunInvocation}
          method={data.selectedMethod}
          loading={
            uploadWasm.isLoadingContract ||
            uploadWasm.isRunningInvocation ||
            statusState.wallet.loading
          }
          handleOpenUploadWasmModal={uploadWasm.handleOpenUploadWasmModal}
        />
        {data.contractId ? (
          <div
            className="flex flex-col w-full h-full gap-2 overflow-hidden"
            data-test="tabs-terminal-container "
          >
            <TabsContainer
              data={data}
              preInvocationValue={uploadWasm.preInvocationValue}
              postInvocationValue={uploadWasm.postInvocationValue}
            />
            <Terminal entries={uploadWasm.contractResponses} />
          </div>
        ) : (
          <InvocationCTAPage />
        )}
      </div>
      <UploadWasmDialog
        open={uploadWasm.isModalOpen}
        onOpenChange={uploadWasm.handleCloseModal}
        data={data}
        wallet={wallet[data.network as keyof typeof wallet]}
        loading={loading}
        {...uploadWasm}
      />
    </Fragment>
  );
}
