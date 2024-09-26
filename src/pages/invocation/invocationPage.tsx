import { Loader } from 'lucide-react';
import React, { Fragment, useEffect, useState } from 'react';
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
import useNetwork from '@/common/hooks/useNetwork';
import { Invocation } from '@/common/types/invocation';
import { BACKEND_NETWORK, NETWORK } from '@/common/types/soroban.enum';
import { useAuthProvider } from '@/modules/auth/hooks/useAuthProvider';
import { IWallet } from '@/modules/auth/interfaces/IAuthenticationContext';
import { IStatusState } from '@/modules/auth/interfaces/IStatusState';
import useInvocation from '@/modules/invocation/hooks/useInvocation';

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
  const { handleUpdateNetwork } = useNetwork(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    handleLoadContract,
    isLoadingContract,
    contractResponses,
    handleRunInvocation,
    isRunningInvocation,
  } = useInvocation(data, wallet, connectWallet);

  const preInvocationValue = React.useMemo(() => {
    return data.preInvocation ?? '';
  }, [data]);

  const postInvocationValue = React.useMemo(() => {
    return data.postInvocation ?? '';
  }, [data]);

  function handleOpenUploadWasmModal() {
    if (data.network === BACKEND_NETWORK.AUTO_DETECT)
      handleUpdateNetwork(NETWORK.SOROBAN_FUTURENET);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    handleUpdateNetwork(BACKEND_NETWORK.AUTO_DETECT);
    setIsModalOpen(false);
  }

  function handleLoadContractWithLoading(contractId: string) {
    if (!loading && !isLoadingContract) setLoading(true);
    handleLoadContract(contractId);
  }

  useEffect(() => {
    if (data.contractId && loading) setLoading(false);
  }, [data, loading, setLoading]);

  useEffect(() => {
    if (data.contractId && loading) setLoading(false);
  }, [data, loading, setLoading]);

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
          loadContract={handleLoadContract}
          runInvocation={handleRunInvocation}
          method={data.selectedMethod}
          loading={
            isLoadingContract ||
            isRunningInvocation ||
            statusState.wallet.loading
          }
          handleOpenUploadWasmModal={handleOpenUploadWasmModal}
        />
        {data.contractId ? (
          <div
            className="flex flex-col w-full h-full gap-2 overflow-hidden"
            data-test="tabs-terminal-container "
          >
            <TabsContainer
              data={data}
              preInvocationValue={preInvocationValue}
              postInvocationValue={postInvocationValue}
            />
            <Terminal entries={contractResponses} />
          </div>
        ) : (
          <InvocationCTAPage />
        )}
      </div>
      <UploadWasmDialog
        open={isModalOpen}
        onOpenChange={handleCloseModal}
        data={data}
        handleLoadContract={handleLoadContractWithLoading}
        wallet={wallet[data.network as keyof typeof wallet]}
        setLoading={setLoading}
        loading={loading}
      />
    </Fragment>
  );
}
