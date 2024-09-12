import { Loader } from 'lucide-react';
import React from 'react';
import { NavLink, useParams } from 'react-router-dom';

import EnvironmentDropdownContainer from '../Environments/EnvironmentDropdownContainer';
import EnvironmentInput from './EnvironmentInput';
import SaveContractDialog from './SaveContractDialog';

import { Button } from '@/common/components/ui/button';
import useEnvironments from '@/common/hooks/useEnvironments';
import { Method } from '@/common/types/method';

function ContractInput({
  defaultValue = '',
  defaultNetwork,
  loading,
  loadContract,
  runInvocation,
  method,
  handleOpenUploadWasmModal,
  viewMode = false,
  invocationID,
}: Readonly<{
  defaultValue?: string;
  defaultNetwork: string;
  loading: boolean;
  loadContract: (contractId: string) => void;
  runInvocation: () => void;
  method?: Method;
  handleOpenUploadWasmModal?: () => void;
  viewMode?: boolean;
  invocationID?: string;
}>) {
  const [contractId, setContractId] = React.useState(defaultValue);
  const params = useParams();

  const [showEditContractDialog, setShowEditContractDialog] =
    React.useState(false);
  const {
    showEnvironments,
    handleSelectEnvironment,
    handleSearchEnvironment,
    setShowEnvironments,
  } = useEnvironments();

  async function handleUpdateContractId() {
    if (contractId) {
      loadContract(contractId);
      if (window.umami) window?.umami?.track('Load contract');
    }
  }

  function handleSelect(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
    const environmentValue = handleSelectEnvironment(e.currentTarget.id);
    setContractId(`{{${environmentValue}}}`);
  }

  function handleChange(value: string) {
    handleSearchEnvironment(value);
    setContractId(value);
  }

  return (
    <div
      className="flex items-center gap-4 p-2 border rounded-md"
      data-test="contract-input-container"
    >
      {defaultNetwork !== 'AUTO_DETECT' && contractId && (
        <div
          className="flex flex-col items-start gap-1 mr-2"
          data-test="contract-input-network-container"
        >
          <p className="text-sm text-gray-400 select-none">Network:</p>
          <p
            className="text-sm font-bold text-gray-400 select-none text-primary"
            data-test="contract-input-network"
          >
            {defaultNetwork}
          </p>
        </div>
      )}
      <div className="flex w-full gap-4 group">
        {defaultValue ? (
          <div className="relative flex items-center justify-between flex-1 w-full">
            <span
              className={`${
                RegExp(/{{(.*?)}}/).exec(defaultValue) ? 'text-primary' : ''
              } select-none`}
              data-test="contract-input-address"
            >
              {defaultValue}
            </span>
            {!viewMode ? (
              <Button
                variant="link"
                className="absolute right-0 invisible group-hover:visible bg-background"
                data-test="btn-edit-contract-address"
                onClick={() => {
                  setShowEditContractDialog(true);
                  if (window.umami)
                    window?.umami?.track('Open edit contract address dialog');
                }}
              >
                Edit contract address
              </Button>
            ) : (
              <Button
                variant="link"
                className="absolute right-0 invisible group-hover:visible bg-background"
                data-test="btn-edit-contract-address"
                asChild
              >
                <NavLink
                  to={`/collection/${params.collectionId}/invocation/${invocationID}`}
                >
                  Edit contract settings
                </NavLink>
              </Button>
            )}
          </div>
        ) : (
          <EnvironmentDropdownContainer
            handleSelect={handleSelect}
            showEnvironments={showEnvironments}
            setShowEnvironments={setShowEnvironments}
          >
            <EnvironmentInput
              value={contractId}
              handleChange={handleChange}
              styles="h-full"
              placeholder="Contract address"
              testName="input-contract-name"
            />
          </EnvironmentDropdownContainer>
        )}
        {!contractId && (
          <Button
            data-test="contract-input-btn-load"
            className="w-auto px-8 py-3 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={handleOpenUploadWasmModal}
          >
            {!loading ? (
              'UPLOAD'
            ) : (
              <div className="flex items-center gap-1">
                <Loader className="animate-spin" size="14" /> Uploading
              </div>
            )}
          </Button>
        )}
        {!defaultValue ? (
          <Button
            data-test="contract-input-btn-load"
            className="w-auto px-8 py-3 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            disabled={loading || !contractId}
            onClick={() => {
              handleUpdateContractId();
            }}
          >
            {!loading ? (
              'LOAD'
            ) : (
              <Loader className="w-auto font-bold animate-spin" size="20" />
            )}
          </Button>
        ) : (
          !viewMode && (
            <Button
              data-test="contract-input-btn-load"
              className="w-auto px-4 py-3 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              onClick={runInvocation}
              type="button"
              disabled={loading || !method}
            >
              {!loading ? (
                'RUN'
              ) : (
                <div className="flex items-center gap-2">
                  <Loader className="w-auto font-bold animate-spin" size="20" />
                  <p>Running</p>
                </div>
              )}
            </Button>
          )
        )}
      </div>
      {!viewMode && showEditContractDialog && (
        <SaveContractDialog
          open={showEditContractDialog}
          onOpenChange={setShowEditContractDialog}
        />
      )}
    </div>
  );
}

export default ContractInput;
